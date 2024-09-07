import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore, } from '@angular/fire/firestore';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslations } from './domain/services/translator/translation.provider';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions()
    ), 
    provideHttpClient(),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(
      {
        "projectId":"genarocancino-369",
        "appId":"1:35508774182:web:cbcfdf494e8f6484f34de7",
        "storageBucket":"genarocancino-369.appspot.com",
        "apiKey":"AIzaSyD3x2cgJ3eGJ4kaAXnmKUw2x6x5yqv0Z9s",
        "authDomain":"genarocancino-369.firebaseapp.com",
        "messagingSenderId":"35508774182",
        "measurementId":"G-YM98FHYQH7"
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
    provideLottieOptions({ player: () => import('lottie-web') })
  ]
};
