import { Component, DestroyRef, OnInit, inject, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';
import localeEn from '@angular/common/locales/en';
import { RouterOutlet, RouterLink } from '@angular/router';
import { TitleService } from './core/title/title.service';
import { NetworkService } from '@domain/services/network/network.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TranslationService } from '@domain/services/translator/translation.service';

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
  // Injectors
  titleSrv = inject(TitleService);
  networkSrv = inject(NetworkService);
  translator = inject(TranslationService);
  destroyRef = inject(DestroyRef);
  // Variables
  isOnline!: boolean;
  // Signals

  constructor() { 
    this.isOnline = navigator.onLine;
    console.log("Network is: ", this.isOnline ? "Online" : "Offline");
    this.setLocale();
  }

  ngOnInit(): void {
    this.titleSrv.setTitle('Home');
    //appInitialization();
    // Check network connection   
  }

  private setLocale(): void {
    if (this.translator.getCurrentLanguage() === 'es') {
      registerLocaleData(localeEsMx);
    } else {
      registerLocaleData(localeEn);
    }
  }
}
