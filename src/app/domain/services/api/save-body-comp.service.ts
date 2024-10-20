import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { APIResponse } from '@domain/models/api/apiResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveBodyCompService {
  // injectors
  private readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  // observables
  // signals
  csrf_token = signal('');
  patient_token = signal<string | null>('');
  // variables
  backendUrl = 'https://gc-nutrition.vercel.app/'
  // methods

  constructor() {
    this.http.get<any>(this.backendUrl + 'api/generate-csrf-token').pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      this.csrf_token.set(res.csrf_token);
    });

    this.authService.fetchPatientToken().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(token => {
      this.patient_token.set(token);
    });
  }

  saveData(data: Object) {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': this.csrf_token(),
      'Authorization': 'Bearer ' + this.patient_token()
    };

    this.http.post<APIResponse>(this.backendUrl + 'api/save-body-composition', data, { headers }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(res => {
      console.log(res.message);
    });
  }
}
