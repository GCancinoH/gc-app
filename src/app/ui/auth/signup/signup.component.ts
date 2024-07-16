/* Angular Core Imports */
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
/* Angular Material Imports */
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
/* Other Imports */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { TranslatePipe } from '../../../core/translation/translate.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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
  onSignUp() {}
}
