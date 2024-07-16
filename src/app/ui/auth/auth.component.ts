import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TitleService } from '../../core/title/title.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
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

  /* Sign In & Sign Up Functions */
  /*onSignIn() {
    this.isLoading.set(true);
    this.loginForm.disable();
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    this.authSrv.signInWithEmailAndPass(email, password)
      .then(res => {
        if(res.success) {
          this.isLoading.set(false);
          this.snackBar.open("Signed In Successfully!", 'X', {
            duration: 5000
          })
          this.router.navigate(['/u/dashboard']);
        } else {
          this.snackBar.open(res.error!, 'X', {duration: 5000});
          this.isLoading.set(false);
          this.loginForm.enable();
        }
      })
  }*/

  onChangeLanguage(lang: string) {
    this.translator.changeLanguage(lang);
  }

  /*onSignUp() {
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    const name = this.registerForm.get('fullName')?.value;

    this.authSrv.createNewPatient(email, password, name).subscribe(res => {
      if (res.success) {
        console.log(res);
        this.snackBar.open("Usuario Registrado Exitosamente", 'X', { duration: 3000})
      } else {
        this.snackBar.open(res.message!, 'X', { duration: 3000})
      }
    });
  }*/

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
