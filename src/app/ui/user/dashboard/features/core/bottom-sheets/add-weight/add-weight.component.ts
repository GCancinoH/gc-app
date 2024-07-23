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
  weightRegex: RegExp = /^\d{2,3}(\.\d{1,2})?$/;
  doublePattern: RegExp = /^\d{1,2}(\.\d{1,2})?$/gm;
  vfRegex: RegExp = /^\d+$/gm;
  isLoading = signal<boolean>(false);

  // Methods
  constructor() {
    this.addWeightForm = this.fb.group({
      weight: ['', [Validators.required, Validators.pattern(this.weightRegex)]],
      date: ['', [Validators.required]],
      bmi: ['', [Validators.required, Validators.pattern(this.doublePattern), Validators.min(16), Validators.max(50)]],
      visceralFat: ['', [Validators.required, Validators.pattern(this.vfRegex), Validators.max(20)]],
      bodyFat: ['', [Validators.required, Validators.pattern(this.doublePattern), Validators.max(70)]],
      muscle: ['', [Validators.required, Validators.pattern(this.doublePattern), Validators.max(70)]]
    });
  }

  onSubmitData() {}
}
