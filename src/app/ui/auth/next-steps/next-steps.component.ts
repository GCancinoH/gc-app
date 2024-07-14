import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { config } from '../../../core/const';

export interface GenderOptions {
  gender: string;
  value: string;
}

@Component({
  selector: 'app-next-steps',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatSelectModule
  ],
  templateUrl: './next-steps.component.html',
  styleUrl: './next-steps.component.css'
})
export class NextStepsComponent implements OnInit {
  // injects
  router = inject(Router);
  httpClient = inject(HttpClient);
  fb = inject(FormBuilder);

  // variables
  serverURL = config.serverURL;
  steps = signal<number>(1);
  nsForm!: FormGroup;
  weightHeightRegex: RegExp = /^\d+(\.\d{1,2})?$/gm;
  genderOptions: GenderOptions[] = [
    { gender: 'Male', value: 'male' },
    { gender: 'Female', value: 'female' }
  ];

  ngOnInit(): void {
    this.nsForm = this.fb.group({
      weight: ['', [Validators.required, Validators.pattern(this.weightHeightRegex)]],
      height: ['', [Validators.required, Validators.pattern(this.weightHeightRegex)]],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]]
    });
  }

  nextStep() {
    this.steps.update(value => value + 1);
  }

  prevStep() {
    this.steps.update(value => value - 1);
  }

  isCurrentStepValid() {
    switch (this.steps()) {
      case 1:
        return this.nsForm.get('age')?.valid;
      case 2:
        return this.nsForm.get('height')?.valid;
      case 3:
        return this.nsForm.get('weight')?.valid;
      case 4:
        return this.nsForm.get('gender')?.valid;
      default:
        return false;
    }
  }

  onSubmit() {

  }  
}
