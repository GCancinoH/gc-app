import { Component, OnInit, inject, signal } from '@angular/core';
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
  dialogRef = inject(MatDialog);
  // services
  patientService = inject(PatientService);
  // observables  
  // signals
  userHasInitialData = signal<boolean>(false);

  ngOnInit(): void {
    this.userHasInitialData.set(this.patientService.doesPatientHasInitialData());    
  }

  openInitialBodyCompDialog() {
    this.dialogRef.open(InitialBodyCompositionComponent, {
      width: '600px',
      disableClose: false
    });
  }
}
