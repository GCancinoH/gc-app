/* Angular Core Imports */
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
/* Angular Material Imports */
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
/* Other Imports */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { TranslationService } from '@core/translation/translation.service';
import { TranslatePipe } from '@core/translation/translate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'gc-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIcon,
    FontAwesomeModule, TranslatePipe
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {
  // Injects
  fb = inject(FormBuilder);
  authSrv = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  translator = inject(TranslationService);
  // Variables
  googleIcn = faGoogle;
  destroyRef = inject(DestroyRef);
  loginForm!: FormGroup;
  isLoading = signal<boolean>(false);
  isFormDisabled = signal<boolean>(false);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Check when values changes
    this.loginForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(350),
      distinctUntilChanged()
    );
  }

  onSignIn() {
    /* Check if the form is valid */
    if ( !this.loginForm.valid ) {
      this.snackBar.open(
        this.translator.getTranslation("auth.errors.invalid_form"), 'X', {
          duration: 5000
        });
      return;
    }
    this.isLoading.set(true);
    this.loginForm.disable();
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authSrv.signInWithEmailAndPass(email, password)
      .then(res => {
        if(res.success) {
          this.isLoading.set(false);
          this.snackBar.open("Signed In Successfully!", 'X', {
            duration: 5000
          })
          this.router.navigate(['/u/dashboard']);
        } else {
          this.snackBar.open(res.error!, 'X', {duration: 5000});
          this.isLoading.set(false);
          this.loginForm.enable();
        }
      })
  }

  onGoogleSignIn() {}

}
