// Angular
import { Component, DestroyRef, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
// Material
import { MatCard } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBar } from '@angular/material/progress-bar';
// Rxjs
// Otros
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '@domain/services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// RSYBQK5HLS64JEUVGHEVY7CW Twilio Recovery*

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCard, MatButton, MatIcon, MatFormFieldModule, MatInputModule, MatProgressBar,
    FontAwesomeModule
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignInComponent {
  // Injectors
  authSrv = inject(AuthService);
  fb = inject(FormBuilder);
  destroyRef = inject(DestroyRef);
  // Inputs & Outputs
  loadingState = output<boolean>();
  // Signals
  isLoading = signal<boolean>(false);
  isSignInActive = signal<boolean>(true);
  signInStep = signal<number>(1);
  // Computed
  addOneStep = computed(() => this.signInStep() + 1);
  // Variables
  googleIcn = faGoogle;
  signinForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  /*
    Methods
  */
  onChangeState() {
    this.isSignInActive.update(state => !state);
    this.loadingState.emit(this.isSignInActive());
  }

  onNext() {
    // Get the value of email input
    const patientEmail = this.signinForm.get('email')!.value;
    // Check if the user exists or not
    this.authSrv.checkIfTheEmailExistsInDB(patientEmail).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(exists => {
      if (exists === true) {
        this.addOneStep();
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


