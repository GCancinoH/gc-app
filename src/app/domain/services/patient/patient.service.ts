import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, onSnapshot, query, snapToData, where } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  // injectors
  private readonly db = inject(Firestore);
  private readonly authSrv = inject(AuthService);
  // signals
  // variables
  private readonly patientCollection = collection(this.db, 'initialBodyComp');
  //methods
  constructor() { }

  doesPatientHasInitialData(): Observable<boolean>
  {
    const patient = this.authSrv.getUserFromLocalDB();
    const q = query(this.patientCollection, where('uid', '==', patient?.uid));

    return new Observable<boolean>((observer) => {
      onSnapshot(q, (snapshot) => {
        if(!snapshot.empty) {
          const patientDoc = snapshot.docs[0];
          const initialData = patientDoc.data()['initialData'];
          observer.next(!!initialData);
        } else {
          observer.next(false);
        }
      }, (error) => {
        observer.error(error);
      })
    })
  }
}
