import { DestroyRef, Injectable, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
// Angular Fire
import { Auth, UserCredential, authState, idToken, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
import { Firestore, collection, getDocs, query, where } from "@angular/fire/firestore";
import { Patient } from "@domain/models/patient/patient.model";
// Rxjs
import { Observable, Subscription, catchError, from, map, of, switchMap, tap, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Injectors
  auth = inject(Auth);
  db = inject(Firestore);
  destroyRef = inject(DestroyRef);
  // Signals
  userObject = signal<Patient | null>(null);
  idToken$ = idToken(this.auth);
  idTokenSubscription!: Subscription;
  // Observables
  authState$ = authState(this.auth);
  user$ = Subscription;
  // Variables
  patientsCollection = collection(this.db, 'patients');
  
  // Methods
  signInWithEmailAndPass(email: string, password: string) : Observable<UserCredential>
  {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap(userCredentials => console.log('User signed in:', userCredentials.user.uid)),
      catchError(error => {
        console.error('Error signing in:', error);
        return throwError(() => new Error('Sign in failed. Please check your credentials.'));
      }),
      map(userCredentials => { return userCredentials })
    );
  }

  checkIfTheEmailExistsInDB(email: string | null): Observable<boolean> {
    return from(getDocs(query(this.patientsCollection, where('email', '==', email)))).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const patientDoc = snapshot.docs[0];
          const cachedData = localStorage.getItem('currentUser');
          if (cachedData && JSON.parse(cachedData).email === email) {
            this.userObject.set(JSON.parse(cachedData));
            return true;
          } else {
            this.saveUserIntoLocalDB(patientDoc.data() as Patient);
            return true;
          }
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Error checking if email exists:', error);
        return of(false);
      })
    );
  }
  

  fetchPatientToken() : Observable<string | null>
  {
    return this.idToken$.pipe(
      map(token => {
        return token;
      })
    )
  }

  signOut() : Observable<boolean>
  {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.removeUserFromLocalDB()
      }),
      map(() => true),
      catchError(error => {
        console.error('Error signing out:', error);
        return of(false);
      })
    )
  }

  fetchUser(email: string): Observable<Patient | null> {
    return this.getUserFromLocalStorage().pipe(
      switchMap(cachedUser => {
        if (cachedUser) {
          return of(cachedUser);
        } else {
          return this.getUserFromFirestore(email);
        }
      })
    );
  }

  // Private
  private getUserFromLocalStorage() : Observable<Patient | null>
  {
    const cachedData = localStorage.getItem('currentUser');
    return cachedData ? of(JSON.parse(cachedData)) : of(null);
  }

  private getUserFromFirestore(email: string | null): Observable<Patient | null> {
    const q = query(this.patientsCollection, where('email', '==', email));
  
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data() as Patient;
          this.saveUserIntoLocalDB(userData);
          return userData; // Return the actual Patient data
        } else {
          return null; // Return null if user not found
        }
      })
    );
  }

  private saveUserIntoLocalDB(user: Patient)
  {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  public getUserFromLocalDB(): Patient | null
  {
    const storedPatient = localStorage.getItem('currentUser');

    return storedPatient ? JSON.parse(storedPatient) : null;
  }

  private removeUserFromLocalDB() 
  {
    localStorage.removeItem('currentUser');
  }
  
}
