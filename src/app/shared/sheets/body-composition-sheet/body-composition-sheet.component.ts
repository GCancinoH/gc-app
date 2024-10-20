import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Material
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
// Angular Fire
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
// Directives
import { FullWidthDirective } from '@domain/directives/full-width.directive';
import { MarginDirective } from '@domain/directives/margin.directive';
import { PrimaryColorDirective } from '@domain/directives/primary-color.directive';
// Services
import { APIResponse } from '@domain/models/api/apiResponse';
import { AuthService } from '@domain/services/auth/auth.service';
import { catchError, from, of, switchMap } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'gc-body-composition-sheet',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatInputModule, MatIcon, MatButton, MatFormFieldModule, MatDivider,
    FullWidthDirective, MarginDirective, PrimaryColorDirective
  ],
  templateUrl: './body-composition-sheet.component.html',
  styleUrl: './body-composition-sheet.component.css'
})
export class BodyCompositionSheetComponent {
  // injectors
  private readonly db = inject(Firestore);
  private readonly fb = inject(FormBuilder);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly _snackbar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  // observables
  // signals
  csrf_token = signal('');
  patient_token = signal<string | null>('');
  // inputs, outputs, viewchilds, etc
  // services
  // variables
  todayDate = new Date();
  bodyCompForm!: FormGroup;
  backendUrl = 'https://gc-nutrition.vercel.app/'
  // methods

  ngOnInit(): void {
    const patient = localStorage.getItem('currentUser');
    const patientID = JSON.parse(patient!).uid;
    this.bodyCompForm = this.fb.group({
      weight: ['', [Validators.required]],
      bmi: ['', Validators.required],
      visceralFat: ['', Validators.required],
      muscleMass: ['', Validators.required],
      bodyFat: ['', Validators.required],
      date: [this.todayDate],
      uid: patientID
    });

    this.http.get<any>(this.backendUrl + 'api/generate-csrf-token', {withCredentials: true}).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.csrf_token.update(() => res.csrf_token);
      this.bodyCompForm.patchValue({ csrf_token: this.csrf_token() });
      console.log(this.csrf_token());
    });

    this.authService.fetchPatientToken().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(token => {
      this.patient_token.set(token);
    });
  }

  onSubmit(): void {
    if (this.bodyCompForm.invalid) {
      return;
    }

    /* Set the headers */
    const headers = new HttpHeaders({
      'X-CSRFToken': this.csrf_token(),
      'Authorization': 'Bearer ' + this.patient_token()
    });

    /* Send the response to the server and save the data */
    this.http.post<APIResponse>(
      this.backendUrl + 'v1/api/save-body-composition',
      this.bodyCompForm.value,
      {
        headers: headers,
        withCredentials: true
      }
    ).pipe(
      catchError(error => {
        console.log("Server error request:", error);
        return of(null)
      }),
      switchMap(res => {
        if (res && res.success && res.message == "DATA_CHECKED_AND_SANITIZED") {
          const dataCollection = collection(this.db, 'bodyComposition');
          return from(addDoc(dataCollection, this.bodyCompForm.value));
        } else if (res && !res.success && res.message == "DATA_CORRUPTED") {
          return of(null);
        }
        return of(null);
      }),
      catchError(error => {
        console.log("Firebase Error: ", error);
        return of(null);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(response => {
      this.bodyCompForm.reset();
      this._bottomSheet.dismiss();
      this._snackbar.open("Datos guardados exitosamente", "x", {
        duration: 3000
      })
      console.log("Data saved successfully. ", response);
    });    
  }
}
