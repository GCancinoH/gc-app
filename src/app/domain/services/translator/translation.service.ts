import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Inject HttpClient
  private httpClient = inject(HttpClient);

  // Signal to keep track of the current language
  private currentLanguage = signal<string>('es'); // Default language

  // Variable to store translations
  private translations = signal<{ [key: string]: any }>({});

  constructor() {
    // Effect to load translations when the language changes
    effect(() => {
      this.loadTranslations(this.currentLanguage()).subscribe();
    });
  }

  // Function to get the current language
  getCurrentLanguage(): string {
    return this.currentLanguage();
  }

  // Function to set the current language
  changeLanguage(lang: string): void {
    this.currentLanguage.set(lang);
  }

  // Function to load translations
  loadTranslations(lang: string): Observable<boolean> {
    return this.httpClient.get<{ [key: string]: any }>(`./i18n/${lang}.json`).pipe(
      map(data => {
        this.translations.set(data);
        return true;
      }),
      catchError(() => of(false))
    );
  }

  // Function to get a translation
  getTranslation(key: string): string {
    const keys = key.split('.');
    let translation: any = this.translations();
    for (const k of keys) {
      if (translation[k] === undefined) {
        return key;
      }
      translation = translation[k];
    }
    return translation as string;
  }
}