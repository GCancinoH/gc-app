import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComposeLayout } from '@compose-ui/layout/layout.component'

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
  
  // Variables
  addWeightForm!: FormGroup;
  todaysDate = new Date();
  doubleRegex: RegExp = /^\d{2,3}(\.\d{1,2})?$/;
  bmiPattern: RegExp = /^(?:16\.[5-9][0-9]?|1[7-9](\.\d{1,2})?|2[0-9](\.\d{1,2})?|3[0-9](\.\d{1,2})?|4[0-9](\.\d{1,2})?|50(\.00)?)$/
  vfRegex: RegExp = /^(?:[1-9]|1\d|20)$/
  isLoading = signal<boolean>(false);

  // Methods
  constructor() {
    this.addWeightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.pattern(this.doubleRegex)]],
      date: ['', [Validators.required]],
      bmi: ['', [Validators.required, Validators.pattern(this.bmiPattern)]],
      visceralFat: ['', [Validators.required, Validators.pattern(this.vfRegex)]],
      bodyFat: ['', [Validators.required, Validators.pattern(this.doubleRegex)]],
      muscle: ['', [Validators.required, Validators.pattern(this.doubleRegex)]]
    });
  }

  onSubmitData() {}
}
