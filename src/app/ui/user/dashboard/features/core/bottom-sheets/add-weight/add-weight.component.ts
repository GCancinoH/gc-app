import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AsyncValidator } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComposeLayout } from '@compose-ui/layout/layout.component'
import { config } from '@core/const';
import { AuthService } from '@core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { addDoc, collection } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

interface BodyCompositionData {
  uid: string;
  date: Timestamp;
  weight: number;
  bmi: number;
  visceralFat: number;
  bodyFat: number;
  muscle: number;
}

interface Response {
  success: boolean;
  message: string;
  user: string;
}

@Component({
  selector: 'add-weight',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatFormFieldModule, MatInputModule, MatButton, MatIcon,
    ComposeLayout
  ],
  templateUrl: './add-weight.component.html',
  styleUrl: './add-weight.component.css'
})
export class AddWeightComponent {
  // Injects
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authSrv = inject(AuthService);
  bottomSheetRef = inject(MatBottomSheetRef<AddWeightComponent>);
  db = inject(Firestore);
  snackBar = inject(MatSnackBar);
  // Variables
  addWeightForm!: FormGroup;
  todaysDate = new Date();
  weightRegex: RegExp = /^\d{2,3}(\.\d{1,2})?$/;
  doublePattern: RegExp = /^\d{1,2}(\.\d{1,2})?$/;
  vfRegex: RegExp = /^\d+$/;
  isLoading = signal<boolean>(false);
  bodyCompositionCollection = collection(this.db, 'bodyComposition')

  // Methods
  constructor() {
    this.addWeightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.pattern(this.weightRegex)]],
      date: [this.todaysDate],
      bmi: ['', [Validators.required, Validators.pattern(this.doublePattern)]],
      visceralFat: ['', [Validators.required, Validators.pattern(this.vfRegex)]],
      bodyFat: ['', [Validators.required, Validators.pattern(this.doublePattern)]],
      muscle: ['', [Validators.required, Validators.pattern(this.doublePattern)]]
    });
  }

  async onSubmitData() {
    this.addWeightForm.markAllAsTouched();
  
    if (this.addWeightForm.invalid) {
      this.snackBar.open("Formulario inválido", "X", { duration: 5000 });
      return;
    }
    // Initialize the loading state
    this.isLoading.set(true);
    // Getting user data
    const user = this.authSrv.getCurrentUser();
    // Put the data inside the interface
    const data: BodyCompositionData = {
      uid: user!.uid,
      date: Timestamp.fromDate(this.todaysDate),
      weight: this.addWeightForm.get('weight')?.value,
      bmi: this.addWeightForm.get('bmi')?.value,
      visceralFat: this.addWeightForm.get('visceralFat')?.value,
      bodyFat: this.addWeightForm.get('bodyFat')?.value,
      muscle: this.addWeightForm.get('muscle')?.value
    };
    // Try & Catch Block
    try {
      const idToken = await user!.getIdToken();
      const payload = { idToken: idToken };
      const res = await firstValueFrom(this.http.post<Response>(config.serverURL + 'verifyIDToken', payload));
  
      if (res.success) {
        await addDoc(this.bodyCompositionCollection, data);
        this.isLoading.set(false);
        this.bottomSheetRef.dismiss();
        this.snackBar.open("Data guardada con éxito", "X", { duration: 5000 });
      } else {
        console.log("Fuuuuck");
        return;
      }
  
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading.set(false);
    }
  }
}
