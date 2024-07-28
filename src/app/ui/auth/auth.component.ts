import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TitleService } from '../../core/title/title.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/translation/translate.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslationService } from '../../core/translation/translation.service';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    MatButtonModule, MatMenuModule, MatCardModule, MatIcon,
    FontAwesomeModule,
    TranslatePipe, SigninComponent, SignupComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  providers: [MatIconRegistry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  // Injects
  authSrv = inject(AuthService);
  titleSrv = inject(TitleService);
  translator = inject(TranslationService);
  // Variables
  isSignInActive = signal<boolean>(true);
  isSignUpActive = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  googleIcn = faGoogle;
  nameRegex: RegExp = /^[A-Za-zÀ-ÿ]+(\s[A-Za-zÀ-ÿ]+){1}$/gm;
  iconReg = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.titleSrv.setTitle('Authentication');
  }

  constructor() {
    this.iconReg.addSvgIcon('lang-mx', this.sanitizer.bypassSecurityTrustResourceUrl('./images/svg/mx.svg'));
    this.iconReg.addSvgIcon('lang-us', this.sanitizer.bypassSecurityTrustResourceUrl('./images/svg/us.svg'));
  }

  onChangeLanguage(lang: string) {
    this.translator.changeLanguage(lang);
  }

  onGoogleSignIn() {
    console.log('Google sign in');
  }

  /* Change state functions */
  activateSignIn() {
    this.isSignInActive.set(true);
    this.isSignUpActive.set(false);
  }

  activateSignUp() {
    this.isSignInActive.set(false);
    this.isSignUpActive.set(true);
  }
}
