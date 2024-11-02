import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore, doc, writeBatch } from '@angular/fire/firestore';
import { DailyQuests, QuestStatus } from '@domain/models/quests.model';
import { BehaviorSubject, Observable, catchError, filter, from, fromEvent, map, of, switchMap, tap, timer, timestamp } from 'rxjs';
import { ProgressService } from './progress.service';
import { quests } from './quests';
import { initializeApp } from '@angular/fire/app';

interface QuestUpdate {
  questID: string;
  status: QuestStatus;
  finishedAt?: Date;
  timestamp: number;
  userID: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestsService {
  // injectors
  private readonly _db = inject(Firestore);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _progressService = inject(ProgressService);
  // signals
  private readonly dailyQuest = signal<DailyQuests[]>([]);
  private readonly userStreak = signal<number>(0);
  private readonly lastQuestDate = signal<Date | null>(null);
  // computed
  readonly completedQuests = computed(() => 
    this.dailyQuest().filter(q => q.status === 'QUEST_COMPLETED')
  );
  readonly activeQuests = computed(() => 
    this.dailyQuest().filter(q => q.status === 'QUEST_IN_PROGRESS')
  );
  readonly notStartedQuests = computed(() => 
    this.dailyQuest().filter(q => q.status === 'QUEST_NOT_STARTED')
  );
  // observables
  private readonly isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);
  // variables
  readonly initialReps = {
    'PUSH_UPS': 5,
    'PULL_UPS': 3,
    'SQUATS': 5,
    'RAISE_UPS': 3,
    'RUNNING': 0.5
  }
  private pendingUpdates = new Map<string, QuestUpdate>();

  constructor() { }

  startQuests(): void
  {
    this._loadFromLocalStorage();
    if(this.dailyQuest().length === 0) {
      this.initializeDailyQuests().pipe(
        takeUntilDestroyed(this._destroyRef)
      ).subscribe();
    }

    this._initializeDailyReset();
    this._initializeBatchUpdates();
    this._initializeOnlineListener();
  }

  /* Initialize daily quests */
  initializeDailyQuests(): Observable<DailyQuests[]>
  {

    return this._generateDailyQuests().pipe(
      tap(quests => {
        this.dailyQuest.set(quests);
        this._saveToLocalStorage();
      })
    )
  }

  findDailyQuest(questID: string)
  {
    console.log(questID);
    return this.dailyQuest().find(q => q.questID === questID);
  }

  /* Get current quests */
  getDailyQuests(): Observable<DailyQuests[]>
  {
    return of(this.dailyQuest());
  }

  updateQuestsStatus(questID: string, status: QuestStatus): Observable<void>
  {
    return of(this.dailyQuest()).pipe(
      map(quests => {
        const updatedQuests = quests.map(quest => {
          if(quest.questID === questID) {
            const finishedAt = status === 'QUEST_COMPLETED' ? new Date() : null;
            return { ...quest, status, finishedAt };
          }
          return quest;
        });

        this.dailyQuest.set(updatedQuests);
        this._saveToLocalStorage();

        // Queue update for Firestore
        this._queueQuestUpdate({
          questID,
          status,
          finishedAt: status === 'QUEST_COMPLETED' ? new Date() : undefined,
          timestamp: Date.now(),
          userID: 'ytytytyt'
        });

        if (status === 'QUEST_COMPLETED') {
          const quest = quests.find(q => q.questID === questID);
          if (quest) {
            this._updateQuestRewards(quests);
          }
        }
      })
    )
  }

  /*
    Initializers
  */
  private _initializeDailyReset(): void
  {
    timer(0, 3600000).pipe( // Check every hour
      tap(() => this._checkAndResetQuests())
    ).subscribe();
  }

  private _initializeBatchUpdates(): void
  {
    timer(0, 360000).pipe(
      filter(() => this.pendingUpdates.size > 0),
      switchMap(() => this._processPendingUpdates()),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  private _initializeOnlineListener(): void
  {
    fromEvent(window, 'online').pipe(
      tap(() => {
        this.isOnline$.next(true);
        this._processPendingUpdates();
      })
    ).subscribe();

    fromEvent(window, 'offline').pipe(
      tap(() => this.isOnline$.next(false))
    ).subscribe();
  }

  private _resetDailyQuests(): void {
    const resetQuests = this.dailyQuest().map(quest => ({
      ...quest,
      status: 'QUEST_NOT_STARTED' as QuestStatus,
      finishedAt: null,
      createdAt: new Date()
    }));

    this.dailyQuest.set(resetQuests);
    this.lastQuestDate.set(new Date());
    this._saveToLocalStorage();
    
    // Queue update to Firestore
    resetQuests.forEach(quest => {
      this._queueQuestUpdate({
        questID: quest.questID,
        status: quest.status,
        timestamp: Date.now(),
        userID: 'current-user-id' // Replace with actual user ID
      });
    });
  }

  private _generateDailyQuests(): Observable<DailyQuests[]>
  {
    const q: DailyQuests[] = quests;
    return of(q);
  }  

  private _checkAndResetQuests(): void {
    const lastDate = this.lastQuestDate();
    if (lastDate && this._isNewDay(lastDate)) {
      this._resetDailyQuests();
    }
  }

  private _processPendingUpdates(): Observable<void>
  {
    return of(Array.from(this.pendingUpdates.values())).pipe(
      map(updates => {
        const batch = writeBatch(this._db);

        updates.forEach(update => {
          const patientRef = doc(this._db, `patients/${update.userID}/quests/${update.questID}`);
          batch.update(patientRef, {
            [`quests.${update.questID}`]: {
              status: update.status,
              finishedAt: update.finishedAt
            }
           });
        });
        return batch;
      }),
      switchMap(batch => from(batch.commit())),
      tap(() => this.pendingUpdates.clear()),
      catchError(error => {
        console.log('Failed to process updates: ', error)
        return of(undefined)
      })
    );
  }

  private _isNewDay(lastDate: Date): boolean
  {
    const now = new Date();
    const last = new Date(lastDate);
    return now.getDate() !== last.getDate() || 
      now.getMonth() !== last.getMonth() || 
      now.getFullYear() !== last.getFullYear();
  }

  private _loadFromLocalStorage(): void
  {
    const data = localStorage.getItem('dailyQuests');
    if (data) {
      const parsed = JSON.parse(data);
      this.dailyQuest.set(parsed.quests);
      this.userStreak.set(parsed.streak);
      this.lastQuestDate.set(new Date(parsed.lastQuestDate));
    }
  }

  private _saveToLocalStorage(): void
  {
    const data = {
      quests: this.dailyQuest(),
      streak: this.userStreak(),
      lastQuestDate: this.lastQuestDate(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('dailyQuests', JSON.stringify(data));
  }

  private _queueQuestUpdate(update: QuestUpdate): void
  {
    const key = `${update.userID}_${update.questID}_${update.timestamp}`;
    this.pendingUpdates.set(key, update);
  }

  private _updateQuestRewards(quests: DailyQuests[]): void
  {
  
  }

  private _updateStreak(): void
  {
    const currentStreak = this.userStreak();
    this.userStreak.set(currentStreak + 1);
    this._saveToLocalStorage();
  }

  /*
  initializeQuests(): DailyQuests[] 
  {
    const quests: DailyQuests[] = [];

    quests.push(
      {
        questID: '001',
        name: 'STRENGHT_QUEST',
        description: 'STRENGHT_QUEST_DESCRIPTION',
        rewardXP: 30,
        status: 'QUEST_NOT_STARTED',
        createdAt: new Date(),
        finishedAt: null,
        type: 'STRENGHT',
        details: {
          kind: 'exercise',
          exercises: [
            { exercise: 'PUSH_UPS', reps: this.initialReps.PUSH_UPS },
            { exercise: 'PULL_UPS', reps: this.initialReps.PULL_UPS },
            { exercise: 'SQUATS', reps: this.initialReps.SQUATS },
            { exercise: 'RAISE_UPS', reps: this.initialReps.RAISE_UPS},
            { exercise: 'RUNNING', reps: 0, km: this.initialReps.RUNNING }
          ]
        }
      }
    )

    // Save the daily quests
    this._storeDailyQuestsLocally(quests);

    return quests;
  }

  getDailyQuests(): DailyQuests[]
  {
    const quest = JSON.parse(localStorage.getItem('dailyQuests')!);
    this.dailyQuest.set(quest);
    return this.dailyQuest();
  }

  updateDailyQuest(quest: DailyQuests, status: QuestStatus)
  {
    const questIndex = this.dailyQuest().findIndex(q => q.questID === quest.questID);
    this.dailyQuest()[questIndex].status = status;
    this.dailyQuest()[questIndex].finishedAt = new Date();
    this._storeDailyQuestsLocally(this.dailyQuest());
  }

  syncQuestsToBackend()
  {

  }

  private _initializeDailyCheck(): void
  {
    timer(0, 86400000).pipe(
      map(() => )
    )
  }

  private _storeDailyQuestsLocally(quests: DailyQuests[]): void
  {
    localStorage.setItem('dailyQuests', JSON.stringify(quests));
  }*/
}
