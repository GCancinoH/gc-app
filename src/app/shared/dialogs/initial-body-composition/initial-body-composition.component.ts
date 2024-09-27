import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LiveAnnouncer } from '@angular/cdk/a11y';
// Material
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
// RxJS
// Models
import { Objetives } from '@domain/models/patient/data/objetives';
// Services
// Directives
import { PrimaryColorDirective } from '@domain/directives/primary-color.directive';
import { FullWidthDirective } from '@domain/directives/full-width.directive';
import { MaterialOutlinedDirective } from '@domain/directives/material-outlined.directive';
// Others

@Component({
  selector: 'gc-initial-body-composition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule, MatIcon, MatSelectModule, MatChipsModule,
    MatAutocompleteModule,
    FullWidthDirective, PrimaryColorDirective, MaterialOutlinedDirective
  ],
  templateUrl: './initial-body-composition.component.html',
  styleUrl: './initial-body-composition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialBodyCompositionComponent {
  // injectors
  fb = inject(FormBuilder);
  // signals
  formStep = signal<number>(1);
  readonly patientActivities = signal<string[]>([]);
  // observables
  // computed
  nextStep = computed(() => this.formStep() + 1);
  prevStep = computed(() => this.formStep() - 1);
  // variables
  initialBodyCompForm: FormGroup;
  patientObjectives: Objetives[] = [
    {value: 'lose-fat', viewValue: 'Perder Masa Grasa'},
    {value: 'maintain', viewValue: 'Mantenimiento'},
    {value: 'gain-muscle', viewValue: 'Ganar Masa Muscular'}
  ];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  

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
    // variables
    const age = this.initialBodyCompForm.get('age');
    // set the step
    this.formStep.set(this.nextStep());
    if (this.formStep() === 2 && age?.invalid) {
      this.formStep.set(this.prevStep());
      age.hasError('required');
    }
  }
  onPreviousStep() { this.formStep.set(this.prevStep()); }

  saveInitialBodyCompData() {}

}
