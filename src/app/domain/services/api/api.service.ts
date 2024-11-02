import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, debounceTime, map, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { StringFormat } from '@angular/fire/storage';
import { APIResponse } from '@domain/models/api/apiResponse';

export interface HeaderValues {
  'csrf_token': string;
  'auth_token': string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // injectors
  private readonly _authService = inject(AuthService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _http = inject(HttpClient);
  // signals
  private patientIDToken = signal<string | null>(null);
  // observables
  private csrf_token = new BehaviorSubject<string | null>(null);
  // variables
  private readonly backendUrl = 'https://gc-nutrition.vercel.app/'

  fetchCSRFToken(token: string | null): Observable<string | null> {
    const headers = {
      'Authorization': 'Bearer ' + token
    };
    return this._http.get<{csrf_token: string}>(this.backendUrl + 'v1/api/generate-csrf-token', 
      { withCredentials: true, headers: headers } 
    ).pipe(
      map(response => {
        this.csrf_token.next(response.csrf_token);
        return response.csrf_token;
      }),
      catchError(error => {
        console.log('Error fetching CSRF token:', error);
        this.csrf_token.next(null);
        return of(null);
      }),
      debounceTime(1000),
      takeUntilDestroyed(this._destroyRef)
    )
  }

  saveInitialData(headerValues: HeaderValues, data: any): Observable<APIResponse>
  {
    const headers = {
      'X-CSRFToken': headerValues.csrf_token,
      'Authorization': 'Bearer ' + headerValues.auth_token
    };
    
    return this._http.post<APIResponse>(
      this.backendUrl + 'v1/api/save-body-composition', data, 
      {headers: headers}
    ).pipe(
      map(response => {
        return response;
      }),
      takeUntilDestroyed(this._destroyRef)
    )  
  }
}
