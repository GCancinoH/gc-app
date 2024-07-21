import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'add-weight',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatFormFieldModule, MatInputModule, MatButton, MatIcon
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

  // Methods
  constructor() {
    this.addWeightForm = this.fb.group({
      weight: ['', [Validators.required]],
      date: ['', [Validators.required]],
      bmi: ['', [Validators.required]],
      visceralFat: ['', [Validators.required]],
      bodyFat: ['', [Validators.required]],
      muscle: ['', [Validators.required]]
    });
  }

  onSubmitData() {}
}
