import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
// Services
import { PatientService } from '@domain/services/patient/patient.service';
import { InitialBodyCompositionComponent } from '@shared/dialogs/initial-body-composition/initial-body-composition.component';
import { UserProgressTrackerComponent } from '@shared/user-progress-tracker/user-progress-tracker.component';

@Component({
  selector: 'gc-dashboard',
  standalone: true,
  imports: [
    MatCard, MatCardContent, MatButton, MatIcon,
    UserProgressTrackerComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // injectors
  private readonly dialogRef = inject(MatDialog);
  private readonly _destroyRef = inject(DestroyRef);
  // services
  private readonly patientService = inject(PatientService);
  // observables  
  // signals
  userHasInitialData = signal<boolean>(false);

  ngOnInit(): void {
    this.patientService.doesPatientHasInitialData().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((hasInitialData) => {
      if(hasInitialData)
        this.userHasInitialData.set(hasInitialData);
    })
  }

  openInitialBodyCompDialog() {
    this.dialogRef.open(InitialBodyCompositionComponent, {
      width: '600px',
      disableClose: false
    });
  }
}
