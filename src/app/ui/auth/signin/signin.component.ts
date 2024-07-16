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
  // Variables
  googleIcn = faGoogle;
  destroyRef = inject(DestroyRef);
  loginForm!: FormGroup;
  isLoading = signal<boolean>(false);

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

  onSignIn() {}
  onGoogleSignIn() {}

}
