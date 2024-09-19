import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// Material
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
// RxJS
// Services
// Others

@Component({
  selector: 'gc-initial-body-composition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule, MatIcon
  ],
  templateUrl: './initial-body-composition.component.html',
  styleUrl: './initial-body-composition.component.css'
})
export class InitialBodyCompositionComponent {
  // injectors
  fb = inject(FormBuilder);
  // signals
  formStep = signal<number>(1);
  // observables
  // computed
  nextStep = computed(() => this.formStep() + 1);
  prevStep = computed(() => this.formStep() - 1);
  // variables
  initialBodyCompForm: FormGroup;

  constructor() {
    this.initialBodyCompForm = this.fb.group({
      age: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      objetive: ['', [Validators.required]],
      physicalActivity: ['', [Validators.required]],
      activities: ['', [Validators.required]]
    });
  }

  onNextStep() { 
    this.formStep.set(this.nextStep());
  }
  onPreviousStep() { this.formStep.set(this.prevStep()); }

  saveInitialBodyCompData() {}

}
