// Angular
import { Component, DestroyRef, computed, inject, output, signal } from '@angular/core';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
// Fire
import { User } from '@angular/fire/auth';
// Rxjs
import { Observable, Subscription } from 'rxjs';
// Otros
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '@domain/services/auth/auth.service';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';


// RSYBQK5HLS64JEUVGHEVY7CW Twilio Recovery*

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule, AsyncPipe, JsonPipe,
    MatCard, MatButton, MatIcon, MatFormFieldModule, MatInputModule, MatProgressBar,
    MatCheckboxModule,
    FontAwesomeModule, TranslatePipe
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignInComponent {
  // Injectors
  authSrv = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  // Inputs & Outputs
  loadingState = output<boolean>();
  // Signals
  isLoading = signal<boolean>(false);
  isSignInActive = signal<boolean>(true);
  signInStep = signal<number>(1);
  patientName = signal<string | undefined>('');
  // Computed
  addOneStep = computed(() => this.signInStep() + 1);
  // Variables
  googleIcn = faGoogle;
  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    showPassword: [false]
  });
  // Observables
  user$!: Observable<User>;

  /*
    Methods
  */
  onChangeState() {
    this.isSignInActive.update(state => !state);
    this.loadingState.emit(this.isSignInActive());
  }

  onNext(): void {
    if (this.signinForm.get('email')!.invalid) {
      this.signinForm.get('email')!.markAsDirty();
      this.signinForm.get('email')!.markAsTouched();
      return;
    }
    this.isLoading.set(true);
    // Get the value of email input
    const patientEmail = this.signinForm.get('email')!.value;
    console.log("User email: ", patientEmail);
    // Check if the user exists or not
    this.authSrv.checkIfTheEmailExistsInDB(patientEmail).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(exists => {
      console.log("Subscribing...");
      if (exists === true) {
        console.log("User exists, changing the state...");
        this.signInStep.set(this.addOneStep());
        console.log("Go to step ", this.signInStep());
        const cachedName = this.authSrv.getUserFromLocalDB()!.displayName!.split(' ')[0];
        this.patientName.set(cachedName);
        this.isLoading.set(false);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  onSignIn() {
    this.isLoading.set(true);
  }
}


