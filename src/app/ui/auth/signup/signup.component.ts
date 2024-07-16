/* Angular Core Imports */
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
/* Angular Material Imports */
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
/* Other Imports */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { TranslatePipe } from '../../../core/translation/translate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'gc-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule, MatFormFieldModule, MatInputModule, MatIcon,
    FontAwesomeModule, TranslatePipe
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  // Injects
  fb = inject(FormBuilder);
  authSrv = inject(AuthService);
  snackBar = inject(MatSnackBar);
  // Variables
  registerForm!: FormGroup;
  googleIcn = faGoogle;
  destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  nameRegex: RegExp = /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){1}$/gm;

  // Methods
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required, Validators.pattern(this.nameRegex)]]
    });

    // Check when values changes
    this.registerForm.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(350),
      distinctUntilChanged()
    );
  }
  onGoogleSignUp() {}
  onSignUp()
  {
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const name = this.registerForm.get('fullName')?.value;

    this.authSrv.createNewPatient(email, password, name).subscribe(res => {
      if (res.success) {
        console.log(res);
        this.snackBar.open("Usuario Registrado Exitosamente", 'X', { duration: 3000})
      } else {
        this.snackBar.open(res.message!, 'X', { duration: 3000})
      }
    });
  }
}
