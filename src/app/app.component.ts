import { Component, DestroyRef, OnInit, inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import localeEn from '@angular/common/locales/en';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TitleService } from './core/title/title.service';
import { appInitialization } from '@core/init';
import { NetworkService } from '@core/services/network.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TranslationService } from '@core/translation/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
})
export class AppComponent implements OnInit {
  titleSrv = inject(TitleService);
  networkSrv = inject(NetworkService);
  translator = inject(TranslationService);
  isOnline!: boolean;
  destroyRef = inject(DestroyRef);

  constructor() { 
    this.isOnline = navigator.onLine;
    this.setLocale();
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Home');
    appInitialization();
    this.networkSrv.isOnline$.pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(isOnline => {
        this.isOnline = isOnline;
        console.log(this.isOnline);
        return this.networkSrv.isOnline$;
      })
    )    
  }

  private setLocale(): void {
    if (this.translator.getCurrentLanguage() === 'es') {
      registerLocaleData(localeEsMx);
    } else {
      registerLocaleData(localeEn);
    }
  }
}
