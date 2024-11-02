import { Component, EventEmitter, ViewChild, effect, inject, signal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem, MatListItemLine, MatListItemTitle, MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { FullWidthDirective } from '@domain/directives/full-width.directive';
import { MarginDirective } from '@domain/directives/margin.directive';
import { PrimaryColorDirective } from '@domain/directives/primary-color.directive';
import { DailyQuests, ExerciseQuest, StrenghtQuest } from '@domain/models/quests.model';
import { ProgressService } from '@domain/services/progress/progress.service';
import { QuestsService } from '@domain/services/progress/quests.service';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';
import { BehaviorSubject, Subscription, interval } from 'rxjs';

@Component({
  selector: 'gc-quests-dialog',
  standalone: true,
  imports: [
    MatDialogTitle, MatDialogActions, MatDialogContent, MatIcon, MatDivider, MatButton,
    MatIconButton, MatList, MatListOption, MatSelectionList, MatListItemTitle, MatListItemLine,
    TranslatePipe, MarginDirective, FullWidthDirective, PrimaryColorDirective
  ],
  templateUrl: './quests.dialog.html',
  styleUrl: './quests.dialog.css'
})
export class QuestsDialogComponent {
  // injectors
  private readonly _data = inject(MAT_DIALOG_DATA);
  private readonly _quests = inject(QuestsService);
  private readonly _progress = inject(ProgressService);
  readonly dialogRef = inject(MatDialogRef);
  // signal
  quest = signal<DailyQuests>({} as DailyQuests);
  detailsToBeDone = signal<ExerciseQuest[]>([]);
  isStarted = signal<boolean>(false);
  isDisabled = signal<boolean>(false);
  // observers
  timerSubscription!: Subscription
  elapsedTime = 0;

  constructor() {
    const foundQuest = this._quests.findDailyQuest(this._data);
    if (foundQuest) {
      this.quest.set(foundQuest);
    }

    effect(() => {
      if (this.isStarted()) {
        this.dialogRef.disableClose = true;
      }
    });

    if(this.quest().details.kind === 'exercise') {
      const details: StrenghtQuest = this.quest().details as StrenghtQuest;
      this.detailsToBeDone.set(details.exercises);
    }
  }

  startQuest(): void
  { 
    this.isStarted.set(true);
    this.timerSubscription = interval(1000).subscribe(() => {
      this.elapsedTime++;
    });
  }

  finishQuest(): void
  {
    // set internal variables
    const questID = this.quest().questID;
    // Update quest status
    this._quests.updateQuestsStatus(questID, 'QUEST_COMPLETED').subscribe();
    // Update user streak
    this._progress.updateProgress(this.quest().rewards.xp);
    // Close dialog
    this.dialogRef.close();
  }

  onSelectedOption(event: MatSelectionListChange)
  {
    const selectedLenght = event.source.selectedOptions.selected.length;
    if(this.detailsToBeDone().length == selectedLenght) {
      this.timerSubscription.unsubscribe();
      this.isDisabled.set(true);
    }
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return (
      (hours < 10 ? '0' : '') + hours + ':' +
      (minutes < 10 ? '0' : '') + minutes + ':' +
      (secs < 10 ? '0' : '') + secs
    );
  }


}
