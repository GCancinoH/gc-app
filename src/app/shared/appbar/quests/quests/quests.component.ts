import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
import { MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { BehaviorSubject, Subscription } from 'rxjs';
// Services
import { QuestsService } from '@domain/services/progress/quests.service';
import { DailyQuests } from '@domain/models/quests.model';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';
import { QuestsDialogComponent } from '@shared/dialogs/quests/quests/quests.dialog';

@Component({
  selector: 'gc-quests-appbar',
  standalone: true,
  imports: [
    MatIconButton, MatIcon, MatMenuModule, MatBadgeModule, MatListModule,
    TranslatePipe, AsyncPipe
  ],
  templateUrl: './quests.component.html',
  styleUrl: './quests.component.css'
})
export class QuestsComponent implements OnInit {
  // injectors
  private readonly _iconRegistry = inject(MatIconRegistry);
  private readonly _sanitizer = inject(DomSanitizer);
  private readonly _dialog = inject(MatDialog);
  // signals
  quests = signal<DailyQuests[]>([]);
  // observable
  quests$ = new BehaviorSubject<DailyQuests[]>([]);
  

  constructor()
  {
    // Initialize icons
    this._setupIcons();    
  }

  ngOnInit(): void
  {
    this._loadQuests();
  }

  openQuest(questID: string)
  {
    this._dialog.open(QuestsDialogComponent, {
      data: questID,
      disableClose: false,
      width: '560px'
    });
  }

  private _loadQuests() {
    console.log('Loading quests...');
    const quest = localStorage.getItem('dailyQuests');
    console.log('Raw localStorage data:', quest);
    
    if (quest) {
      const parsedQuests = JSON.parse(quest);
      console.log('Parsed quests:', parsedQuests);
      
      const notStartedQuests = parsedQuests.quests.filter((q: DailyQuests) => {
        console.log(`Quest ${q.questID} status: ${q.status}`);
        return q.status === 'QUEST_NOT_STARTED';
      });
      
      console.log('Filtered not started quests:', notStartedQuests);
      
      // Update both the signal and BehaviorSubject
      this.quests.set(notStartedQuests);
      this.quests$.next(notStartedQuests);
      
      console.log('Current quests signal value:', this.quests());
      console.log('Current quests$ value:', this.quests$.value);
    } else {
      // Clear both when no quests are found
      console.log('No quests found in localStorage');
      this.quests.set([]);
      this.quests$.next([]);
    }
  }

  private _setupIcons(): void
  {
    this._iconRegistry.addSvgIcon(
      'quests',
      this._sanitizer.bypassSecurityTrustResourceUrl('images/svg/quests.svg')
    );
    this._iconRegistry.addSvgIcon(
      'incomplete_quest',
      this._sanitizer.bypassSecurityTrustResourceUrl('images/svg/quest_incomplete.svg')
    );
  }
}
