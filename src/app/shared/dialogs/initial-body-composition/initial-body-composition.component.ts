import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef, model } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
// Firebase
import { Timestamp, addDoc, collection } from '@angular/fire/firestore';
// Material
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
// RxJS
// Models
import { Objetives } from '@domain/models/patient/data/objetives';
// Services
// Directives
import { PrimaryColorDirective } from '@domain/directives/primary-color.directive';
import { FullWidthDirective } from '@domain/directives/full-width.directive';
import { MaterialOutlinedDirective } from '@domain/directives/material-outlined.directive';
import { MarginDirective } from '@domain/directives/margin.directive';
import { PhysicalActivity } from '@domain/models/patient/data/physicalActivities';
import { Alergias, alergiasAlimenticias } from '@domain/models/patient/data/alergies';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Firestore } from '@angular/fire/firestore';
import { ComposeLoading } from '../../../core/components/loading/loading';
import { FocusNextDirective } from '@domain/directives/focus-next.directive';
import { DatePipe } from '@angular/common';
import { DateTransformPipe } from '@domain/pipes/date-transform.pipe';
// Others

@Component({
  selector: 'gc-initial-body-composition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule, MatIcon, MatSelectModule, MatChipsModule,
    MatAutocompleteModule, MatSlideToggleModule, MatDatepickerModule,
    FullWidthDirective, PrimaryColorDirective, MaterialOutlinedDirective, MarginDirective,
    ComposeLoading, FocusNextDirective
  ],
  providers: [provideNativeDateAdapter(), DateTransformPipe],
  templateUrl: './initial-body-composition.component.html',
  styleUrl: './initial-body-composition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialBodyCompositionComponent {
  // injectors
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _db = inject(Firestore);
  // signals
  formStep = signal<number>(1);
  allergies = signal<string[]>([]);
  currentAllergy = model('');
  isLoading = signal<boolean>(false);
  // observables
  // computed
  nextStep = computed(() => this.formStep() + 1);
  prevStep = computed(() => this.formStep() - 1);
  // variables
  private readonly _currentYear = new Date().getFullYear();
  readonly maxDate = new Date(this._currentYear - 18, 0, 1);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  datePipe!: DatePipe;
  hasAllergies = false;
  initialBodyCompForm: FormGroup;
  patientObjectives: Objetives[] = [
    {value: 'lose-fat', viewValue: 'Perder Masa Grasa'},
    {value: 'maintain', viewValue: 'Mantenimiento'},
    {value: 'gain-muscle', viewValue: 'Ganar Masa Muscular'}
  ];
  patientPhysicalActivities: PhysicalActivity[] = [
    {name: "Sedentario", value: 1.0},
    {name: "Ligera", value: 1.2},
    {name: "Moderada", value: 1.4},
    {name: "Activa", value: 1.5},
    {name: "Muy Activa", value: 1.0},
  ];
  patientAllergies: Alergias[] = alergiasAlimenticias;
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  

  constructor(private dateTransform: DateTransformPipe) {
    this.initialBodyCompForm = this._fb.group({
      birthday: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18)]],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      goal: ['', [Validators.required]],
      bodyFat: ['', [Validators.required]],
      muscleMass: ['', [Validators.required]],
      activities: ['', [Validators.required]],
      physicalActivity: ['', [Validators.required]],
      hasAllergies: [false],
      allergies: [[]]
    });

    // Listen to the toggle
    this.initialBodyCompForm.get('hasAllergies')?.valueChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(hasAllergies => {
      if (!hasAllergies) {
        this.initialBodyCompForm.get('allergies')?.setValue([]);
      }
    });
  }

  onNextStep() {
    this.formStep.set(this.nextStep());
  }

  onPreviousStep() { this.formStep.set(this.prevStep()); }

  saveInitialBodyCompData() {
    this.isLoading.set(true);
    const patient = JSON.parse(localStorage.getItem('currentUser')!);
    const todayDate = new Date();
    const data = {
      uid: patient.uid,
      date: todayDate,
      age: this.initialBodyCompForm.get('age')?.value,
      initialWeight: this.initialBodyCompForm.get('weight')?.value,
      initialHeight: this.initialBodyCompForm.get('height')?.value,
      initialBMI: this._calculateBMI(),
      goal: this.initialBodyCompForm.get('goal')?.value,
      physicalActivity: this.initialBodyCompForm.get('physicalActivity')?.value,
      allergies: this.initialBodyCompForm.get('allergies')?.value
    }

    console.log(data);
    //this.isLoading.set(false);

    /* const initDataCol = collection(this._db, 'initialDataPatients');
    const initDataDoc = addDoc(initDataCol, data);
    initDataDoc.then(docRef => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch(error => {
      console.error('Error adding document: ', error);
    }); */
    
  }

  get activities() { return this.initialBodyCompForm.get('activities') as FormArray; }

  selectAllergy(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    const allergies = this.initialBodyCompForm.get('allergies')?.value as string[];
    if (!allergies.includes(value)) {
      this.initialBodyCompForm.get('allergies')?.setValue([...allergies, value]);
    }
  }

  removeAllergy(allergyToRemove: string): void {
    const allergies = this.initialBodyCompForm.get('allergies')?.value as string[];
    const updatedAllergies = allergies.filter(allergy => allergy !== allergyToRemove);
    this.initialBodyCompForm.get('allergies')?.setValue(updatedAllergies);
  }

  _calculateBMI(): number {
    return this.initialBodyCompForm.get('weight')?.value / Math.pow(this.initialBodyCompForm.get('height')?.value, 2);
  }

  events = signal<Date>(new Date());

  addEvent(event: MatDatepickerInputEvent<Date>) {
    if(event.value !== null) {
      this.initialBodyCompForm.get('birthday')?.setValue(event.value);
      const age = this._calculateAge(event.value);
      console.log(age);
    }
  }

  // Private methods
  private _calculateAge(birthday: Date): number {
    const today = new Date().getFullYear();
    let age = today - birthday.getFullYear();
    const month = today - birthday.getMonth();
    if (month < 0 || (month === 0 && today < birthday.getDate())) {
      age--;
    }
    return age;
  }

  private _validateStep(step: number, form: string) {
    const formToCheck = this.initialBodyCompForm.get(form);

    switch(step) {
      case 2:
        this.initialBodyCompForm.get(form)
        if (formToCheck?.invalid && formToCheck?.hasError('required')) {
          return;

        } 
        break;

      case 3:
        break;

      case 4:
        break;

      case 5:
        break;

      case 6:
        break;
    }

  }

}
