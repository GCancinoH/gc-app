import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { PatientProgress } from '@domain/models/patient/data/progress';
import { Levels, levels } from '@domain/models/patient/data/levels';
import { Observable, catchError, filter, from, map, of, switchMap, tap, timer } from 'rxjs';
import { Firestore, doc, writeBatch } from '@angular/fire/firestore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface QueuedUpdate {
  progress: PatientProgress;
  timestamp: number;
  uID: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  // injectors
  private readonly _db = inject(Firestore);
  private readonly _destroyRef = inject(DestroyRef);
  // signals
  readonly userProgress = signal<PatientProgress | null>(null);
  // variables
  lvl = levels;
  private readonly BATCH_INTERVAL = 6000;
  private readonly BATCH_SIZE = 500;
  private pendingUpdates = new Map<string, QueuedUpdate>();

  constructor() {
    this._initializeBatchUpdate();

  }

  fetchUserProgress() : PatientProgress | null
  {
    const patient = localStorage.getItem('currentUser');
    if(patient) {
      const storedProgress = JSON.parse(patient).progress;
      this.userProgress.set(storedProgress);
    }
    return this.userProgress();
  }

  calculateProgressPercentage(data: PatientProgress | null): number 
  {
    const categoryLevels = this.lvl[data!.currentCategory as keyof Levels];
    const currentLevelExp = categoryLevels[data!.level];
    const nextLevelExp = categoryLevels[data!.level + 1] || currentLevelExp;
    const progressInLevel = data!.exp - currentLevelExp;
    const levelRange = nextLevelExp - currentLevelExp;
    return Math.min(Math.round((progressInLevel / levelRange) * 100), 100);
  }

  getNextLevelExp(data: PatientProgress | null): number
  {
    const categoryLevels = levels[data!.currentCategory as keyof Levels];
    return categoryLevels[data!.level + 1] || categoryLevels[data!.level];
  }

  getPointsToNextLevel(data: PatientProgress | null): number
  {
    const nextLevelExp = this.getNextLevelExp(data);
    return Math.max(nextLevelExp - data!.exp, 0);
  }

  updateProgress(expGained: number): Observable<PatientProgress | null>
  {
    const currentProgress = this.userProgress();

    if(!currentProgress)
      throw new Error('User progress not found');

    const updatedProgress = this._calculateNewProgress(currentProgress, expGained);
    console.log("Update progress: ", updatedProgress);

    this.userProgress.set(updatedProgress);
    return of(this.userProgress());
  }

  private _calculateNewProgress(currentProgress: PatientProgress | null, expGained: number): PatientProgress | null
  {
    let newExp = currentProgress!.exp + expGained;
    let newLevel = currentProgress!.level;
    let newCategory = currentProgress!.currentCategory;

    const nextLevelExp = this.getNextLevelExp(this.userProgress());
    
    if (newExp >= nextLevelExp) {
      newLevel++;

      if(this._shouldChangeCategory(newCategory, newLevel, newExp)) {
        const nextCategory = this._getNextCategory(newCategory);
        if(nextCategory) {
          newCategory = nextCategory;
          newLevel = 1;
        }
      }
    }
    return {
      currentCategory: newCategory,
      level: newLevel,
      exp: newExp
    };
  }

  private _createUpdateKey(uID: string): string
  {
    return `${uID}_${Date.now()}`;
  }

  private _getLatestUpdatesPerUser(updates: QueuedUpdate[]): QueuedUpdate[]
  {
    const userUpdates = new Map<string, QueuedUpdate>();

    updates.forEach(update => {
      const existing = userUpdates.get(update.uID);
      if(!existing || existing.timestamp < update.timestamp) {
        userUpdates.set(update.uID, update);
      }
    });

    return Array.from(userUpdates.values());
  }

  private _getNextCategory(currentCategory: string): string | null
  {
    const categories = {
      CATEGORY_BEGINNER: 'CATEGORY_INTERMEDIATE',
      CATEGORY_INTERMEDIATE: 'CATEGORY_ADVANCED',
      CATEGORY_ADVANCED: null
    };
    return categories[currentCategory as keyof typeof categories] || null;
  }
  
  private _hasProgressChanged(old: PatientProgress, new_: PatientProgress): boolean
  {
    return old.level !== new_.level ||
      old.exp !== new_.exp ||
      old.currentCategory !== new_.currentCategory;
  }

  private _initializeBatchUpdate(): void {
    timer(0, this.BATCH_INTERVAL).pipe(
      filter(() => this.pendingUpdates.size > 0),
      switchMap(() => {
        const updates = Array.from(this.pendingUpdates.values());
        this.pendingUpdates.clear();
        return this._processBatch(updates);
      }),
      takeUntilDestroyed(this._destroyRef)
    ).subscribe();
  }

  private _processBatch(updates: QueuedUpdate[]): Observable<void> {
    return of(updates).pipe(
      // Get latest updates per user
      map(updates => this._getLatestUpdatesPerUser(updates)),
      
      // Create and fill the batch
      map(latestUpdates => {
        const batch = writeBatch(this._db);
        
        latestUpdates.forEach(update => {
          const userRef = doc(this._db, 'patients', update.uID);
          batch.update(userRef, {
            progress: update.progress,
            lastUpdated: new Date()
          });
        });
        
        return { batch, latestUpdates };
      }),
      
      // Commit the batch
      switchMap(({ batch, latestUpdates }) => 
        from(batch.commit()).pipe(
          tap(() => console.log(`Batch processed: ${latestUpdates.length} updates`)),
          map(() => undefined)
        )
      ),
      
      // Error handling
      catchError(error => {
        console.error('Batch update failed:', error);
        // Requeue failed updates
        updates.forEach(update => {
          const key = this._createUpdateKey(update.uID);
          this.pendingUpdates.set(key, update);
        });
        return of(undefined);
      })
    );
  }


  private _shouldChangeCategory(category: string, level: number, exp: number): boolean
  {
    const categoryLevels = levels[category as keyof Levels];
    const maxLevel = Math.max(...Object.keys(categoryLevels).map(Number));
    return level > maxLevel;
  }
}