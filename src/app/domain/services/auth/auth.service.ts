import { DestroyRef, Injectable, inject, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
// Angular Fire
import { Auth, UserCredential, authState, signInWithEmailAndPassword, signOut } from "@angular/fire/auth";
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
    return this.getUserFromLocalStorage().pipe(
      switchMap(cachedData => {
        if (cachedData && cachedData.email === email) {
          this.userObject.set(cachedData); // Set the user object (doesn't return anything)
          return of(true); // Emit true to signal email exists
        } else {
          return this.getUserFromFirestore(email); // Forward the existing observable
        }
      })
    );
  }

  signOut() : Observable<boolean>
  {
    return from(signOut(this.auth)).pipe(
      map(() => {
        this.removeUserFromLocalDB();
        return true
      })
    )
  }

  private getUserFromLocalStorage() : Observable<Patient | null>
  {
    const cachedData = localStorage.getItem('currentUser');
    return cachedData ? of(JSON.parse(cachedData)) : of(null);
  }

  private getUserFromFirestore(email: string | null) : Observable<boolean>
  {
    const q = query(this.patientsCollection, where('email', '==', email));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        if(!snapshot.empty) {
          const userData = snapshot.docs[0].data() as Patient;
          this.saveUserIntoLocalDB(userData);
          return true;
        } else {
          return false;
        }
      })
    )
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
