import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'gc-body-composition-sheet',
  standalone: true,
  imports: [
    ReactiveFormsModule, DatePipe,
    MatInputModule, MatIcon, MatButton, MatFormFieldModule, MatDivider
  ],
  templateUrl: './body-composition-sheet.component.html',
  styleUrl: './body-composition-sheet.component.css'
})
export class BodyCompositionSheetComponent {
  // injectors
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  // observables
  // signals
  // inputs, outputs, viewchilds, etc
  // services
  // variables
  todayDate = new Date();
  bodyCompForm!: FormGroup;
  // methods

  ngOnInit(): void {
    this.bodyCompForm = this.fb.group({
      weight: [''],
      bmi: [''],
      visceralFat: [''],
      muscleMass: [''],
      bodyFat: ['']
    });
  }

  onSubmit(): void {
    console.log(this.bodyCompForm.value);
  }
}
