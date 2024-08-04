import { Provider, APP_INITIALIZER, inject } from '@angular/core';
import { TranslationService } from './translation.service';
import { firstValueFrom } from 'rxjs';

function initializeTranslations(translationService: TranslationService) {
  return () => firstValueFrom(translationService.loadTranslations(translationService.getCurrentLanguage()));
}

export function provideTranslations(): Provider[] {
  return [
    TranslationService,
    {
      provide: APP_INITIALIZER,
      useFactory: () => initializeTranslations(inject(TranslationService)),
      multi: true,
      deps: [TranslationService]
    }
  ];
}