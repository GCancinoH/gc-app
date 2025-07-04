
/*
// Inject
  auth = inject(Auth);
  snackBar = inject(MatSnackBar);
  errorMessage = signal<string>('');
  authState$ = authState(this.auth);
  user$ = user(this.auth);
  userOb$!: Observable<User | null>;
  httpClient = inject(HttpClient);
  destroyRef = inject(DestroyRef);
  translator = inject(TranslationService);
  localDB = inject(LocalDBService);
  // Variables
  res!: AuthResponse;
  public currentUser = signal<User | null>(null);
  userSubscription!: Subscription;

  // Methods
  constructor() {
    effect(() => {
      this.authState$.subscribe((user: User) => {
        if(user) {
          this.currentUser.set(user);
        }
      });
    })
  }

  public getCurrentUser(): User | null
  {
    return this.currentUser();
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
      try {
        const ifUserCreated = await this.localDB.findInUser({ uid: user.uid});
        if (!ifUserCreated) {
          await this.localDB.insertIntoUser({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            token: idToken,
            isLoggedIn: true
          });
        } else {
          this.localDB.updateUser({
            key: 'uid',
            val: user.uid
          }, {isLoggedIn: true});
        }
      } catch (err) {
        console.error(err);
        return {
          success: false,
          message: err as string};
      }
      return res;
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            return {
              success: false,
              error: this.translator.getTranslation('auth.errors.invalid-email')
            };
          case 'auth/user-disabled':
            return {
              success: false,
              error: this.translator.getTranslation('auth.errors.user-disabled')
            };
          case 'auth/user-not-found':
            return {
              success: false,
              error: this.translator.getTranslation('auth.errors.user-not-found')
            };
          case 'auth/wrong-password':
            return {
              success: false,
              error: this.translator.getTranslation('auth.errors.wrong-pass')
            };
          case 'auth/invalid-credential':
            return {
              success: false,
              error: this.translator.getTranslation('auth.errors.invalid-credentials')
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

  getCustomClaims() {
    return this.authState$.pipe(
      take(1),
      switchMap((user: User | null) => {
        return of(user);
      })
    );
  }

  createNewPatient(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(config.serverURL + 'createNewAdmin', { email, password, name })
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
  }*/

/* Imports */
/*
import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth, User, authState, signInWithEmailAndPassword, signOut, user, IdTokenResult, idToken, getIdTokenResult } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, Subscription, catchError, firstValueFrom, map, of, shareReplay, switchMap, take, throwError } from 'rxjs';
import { FirebaseError } from '@angular/fire/app';
import { config } from '../../../core/const';
import { TranslationService } from '../translator/translation.service';
import { AuthResponse } from '../../../core/models/auth.interfaces';
import { initializeDatabase } from '@core/db/auth.db';
import { LocalDBService } from '../../../core/services/localDB.service';
import { Patient } from '@core/models/patient';*/