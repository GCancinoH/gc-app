import { Component, computed, inject, signal } from '@angular/core';
import { PatientProgress } from '@domain/models/patient/data/progress';
import { ProgressService } from '@domain/services/progress/progress.service';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';
import { TranslationService } from '@domain/services/translator/translation.service';

@Component({
  selector: 'gc-user-progress-tracker',
  standalone: true,
  imports: [
    TranslatePipe
  ],
  templateUrl: './user-progress-tracker.component.html',
  styleUrl: './user-progress-tracker.component.css'
})
export class UserProgressTrackerComponent {
  // injects
  private readonly progress = inject(ProgressService);
  // signals
  readonly patientProgress = signal<PatientProgress | null>(null);

  /*
    Methods
  */
  constructor() {
    this.patientProgress.set(this.progress.fetchUserProgress());
  }

  progressPercentage = computed(() => {
    return this.progress.calculateProgressPercentage(this.patientProgress());
  });

  nextLevelExp = computed(() => {
    return this.progress.getNextLevelExp(this.patientProgress());
  });

  pointsToNextLevel = computed(() => {
    return this.progress.getPointsToNextLevel(this.patientProgress());
  });
}
