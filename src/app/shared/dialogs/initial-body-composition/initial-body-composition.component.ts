import { Component, inject, signal, computed, ChangeDetectionStrategy, DestroyRef, model, effect } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl} from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
// Firebase
import { Firestore } from '@angular/fire/firestore';
import { Timestamp, addDoc, collection } from '@angular/fire/firestore';
// Material
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
// RxJS
import { tap } from 'rxjs';
// Models
import { Objetives } from '@domain/models/patient/data/objetives';
import { PhysicalActivity } from '@domain/models/patient/data/physicalActivities';
import { Alergias, alergiasAlimenticias } from '@domain/models/patient/data/alergies';
// Services
import { ProgressService } from '@domain/services/progress/progress.service';
import { NotificationService } from '@domain/services/notification/notification.service';
// Directives
import { PrimaryColorDirective } from '@domain/directives/primary-color.directive';
import { FullWidthDirective } from '@domain/directives/full-width.directive';
import { MaterialOutlinedDirective } from '@domain/directives/material-outlined.directive';
import { MarginDirective } from '@domain/directives/margin.directive';
import { ComposeLoading } from '../../../core/components/loading/loading';
import { ApiService, HeaderValues } from '@domain/services/api/api.service';
import { AuthService } from '@domain/services/auth/auth.service';
// Others

@Component({
  selector: 'gc-initial-body-composition',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton, MatFormFieldModule, MatInputModule, MatIcon, MatSelectModule, MatChipsModule,
    MatAutocompleteModule, MatSlideToggleModule, MatDatepickerModule, MatIconButton,
    FullWidthDirective, PrimaryColorDirective, MaterialOutlinedDirective, MarginDirective,
    ComposeLoading
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './initial-body-composition.component.html',
  styleUrl: './initial-body-composition.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InitialBodyCompositionComponent {
  // injectors
  private readonly _fb = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _progressService = inject(ProgressService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _apiService = inject(ApiService);
  private readonly _authService = inject(AuthService);
  private readonly _dialogRef = inject(MatDialogRef);
  // signals
  formStep = signal<number>(1);
  allergies = signal<string[]>([]);
  currentAllergy = model('');
  isLoading = signal<boolean>(false);
  tokenFromServer = signal<string>('');
  patientIDToken = signal<string>('');
  // observables
  // computed
  nextStep = computed(() => this.formStep() + 1);
  prevStep = computed(() => this.formStep() - 1);
  // variables
  private readonly _currentYear = new Date().getFullYear();
  readonly maxDate = new Date(this._currentYear - 18, 0, 1);
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
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
  backendUrl = 'https://gc-nutrition.vercel.app/'
  

  constructor() {
    this.initialBodyCompForm = this._fb.group({
      birthday: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.min(18)]],
      weight: ['', [Validators.required]],
      height: ['', [Validators.required]],
      goal: ['', [Validators.required]],
      bodyFat: ['', [Validators.required]],
      muscleMass: ['', [Validators.required]],
      activities: this._fb.array([]),
      visceralFat: ['', Validators.required],
      physicalActivity: ['', [Validators.required]],
      hasAllergies: [false],
      allergies: [[]],
    });

    this._authService.fetchPatientToken().pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(idToken => {
      if(idToken)
        this.patientIDToken.set(idToken);
      // Get the token
      this._apiService.fetchCSRFToken(idToken).subscribe(token => {
        if(token) {
          this.tokenFromServer.set(token); 
        }     
      });
    });

    // Listen to the toggle
    this.initialBodyCompForm.get('hasAllergies')?.valueChanges.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(hasAllergies => {
      if (!hasAllergies) {
        this.initialBodyCompForm.get('allergies')?.setValue([]);
      }
    });

    // Add an activity
    this.addActivity();
  }

  onNextStep() {
    this.formStep.set(this.nextStep());
  }

  onPreviousStep() { this.formStep.set(this.prevStep()); }

  saveInitialBodyCompData() {
    this.isLoading.update(() => true);
    const patient = JSON.parse(localStorage.getItem('currentUser')!);
    const todayDate = new Date();
    const data = {
      uid: patient.uid,
      birthday: this.initialBodyCompForm.get('birthday')?.value,
      age: this.initialBodyCompForm.get('age')?.value,
      height: this.initialBodyCompForm.get('height')?.value,
      physicalActivity: this.initialBodyCompForm.get('physicalActivity')?.value,
      activities: this.initialBodyCompForm.get('activities')?.value,
      allergies: this.initialBodyCompForm.get('allergies')?.value,
      initialData: {
        weight: this.initialBodyCompForm.get('weight')?.value,
        goal: this.initialBodyCompForm.get('goal')?.value,
        bodyFat: this.initialBodyCompForm.get('bodyFat')?.value,
        muscleMass: this.initialBodyCompForm.get('muscleMass')?.value,
        visceralFat: this.initialBodyCompForm.get('visceralFat')?.value,
        date: todayDate
      }
    }
    const headerValues: HeaderValues = {
      'csrf_token': this.tokenFromServer(),
      'auth_token': this.patientIDToken()
    }
    
    this._apiService.saveInitialData(headerValues, data).subscribe(r => {
      console.log(r.message);
      this.isLoading.update(() => false);
      this._dialogRef.close();
    });

    /*this._progressService.updateProgress(10).pipe(
      tap((progress) => {
        this._notificationService.showToastrNotification("Hola", "", "success");
      })
    )*/
    
  }

  get activities() { return this.initialBodyCompForm.get('activities') as FormArray; }

  addActivity(): void {
    const activityForm = this._fb.group({
      name: [''],
      duration: ['']
    });
    this.activities.push(activityForm);
  }

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
      this.initialBodyCompForm.get('age')?.setValue(age);
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
