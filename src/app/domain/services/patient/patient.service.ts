import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs, query, snapToData, where } from '@angular/fire/firestore';
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

  doesPatientHasInitialData(): boolean
  {
    let result = false;
    const patient = this.authSrv.getUserFromLocalDB();
    const q = query(this.patientCollection, where('uid','==',patient?.uid));
    getDocs(q).then(snapshot => {
      if(!snapshot.empty) {
        result = true;
      }
    });

    return result;
  }

  //methods
  constructor() { }
}
