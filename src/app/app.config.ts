import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, withViewTransitions } from '@angular/router';
import localeEs from '@angular/common/locales/es';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import { provideTranslations } from './domain/services/translator/translation.provider';
import { provideLottieOptions } from 'ngx-lottie';
import { provideToastr } from 'ngx-toastr';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEs)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions(),
    ),
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'X-CSRFToken',
        headerName: 'X-CSRFToken',
      })
    ),
    provideAnimationsAsync(),
    provideToastr(),
    provideFirebaseApp(() => initializeApp(
      {
        "projectId":"",
        "appId":"",
        "storageBucket":"",
        "apiKey":"",
        "authDomain":"",
        "messagingSenderId":"",
        "measurementId":""
      }
    )),
    provideAuth(() => getAuth()),
    provideFirestore(() => {
      const firestore = getFirestore();
      return firestore;
    }),
    provideMessaging(() => getMessaging()),
    provideStorage(() => getStorage()),
    provideTranslations(),
    provideLottieOptions({ player: () => import('lottie-web') }),
    {
      provide: LOCALE_ID,
      useValue: 'es-MX'
    }
  ]
};
