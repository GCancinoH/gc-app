import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, User, authState, signInWithEmailAndPassword, signOut, user, updateProfile } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription, catchError, firstValueFrom, throwError } from 'rxjs';
import { AuthResponse } from './auth.interfaces';
import { FirebaseError } from '@angular/fire/app';
import { config } from '../const';
import { TranslationService } from '../translation/translation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  snackBar = inject(MatSnackBar);
  errorMessage = signal<string>('');
  authState$ = authState(this.auth);
  user$ = user(this.auth);
  httpClient = inject(HttpClient);
  authStateSubscription!: Subscription;
  destroyRef = inject(DestroyRef);
  translator = inject(TranslationService);
  res!: AuthResponse;

  get userState(): User | null {
    return this.authState$.value;
  }

  async signInWithEmailAndPass(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const { user } = userCredential;

      if (!user.emailVerified) {
        let err = this.translator.getTranslation('auth.login.email_not_verified');
        this.signOut();
        return {
          success: false,
          error: err
        };
      }

      let idToken = '';
      idToken = await user.getIdToken();
      // Handle the http request
      const res = await firstValueFrom(
        this.httpClient.post<AuthResponse>('https://gc-nutrition.vercel.app/v1/api/verifyIDToken', { idToken })
      );
      return res;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            return {
              success: false,
              error: 'Invalid email'
            };
          case 'auth/user-disabled':
            return {
              success: false,
              error: 'This user is disabled.'
            };
          case 'auth/user-not-found':
            return {
              success: false,
              error: 'User not found'
            };
          case 'auth/wrong-password':
            return {
              success: false,
              error: 'Wrong password'
            };
          case 'auth/invalid-credential':
            return {
              success: false,
              error: 'Invalid credentials'
            };
          default:
            console.error('Error signing in:', error);
            return {
              success: false,
              error: 'An unexpected error occurred'
            };
        }
      } else {
        console.error('Error signing in:', error);
        return {
          success: false,
          error: 'An unexpected error occurred'
        };
      }
    }
  }

  signOut()
  {
    return signOut(this.auth);
  }

  createNewPatient(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(config.serverURL + 'createNewUser', { email, password, name })
      .pipe(
        catchError(err => {
          const res: AuthResponse = {
            message: err.message,
            success: false
          };
          return throwError(() => res);
        }),
        takeUntilDestroyed(this.destroyRef)
      );
  }

}
