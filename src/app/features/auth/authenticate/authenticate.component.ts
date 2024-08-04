import { Component, signal } from '@angular/core';
import { SignInComponent } from './sign-in/sign-in';
import { SignUpComponent } from './sign-up/sign-up';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [SignInComponent, SignUpComponent],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent {
  // Injectors
  // Inputs & Outputs
  // Signals
  isLoading = signal<boolean>(false);
  isSignInViewActive = signal<boolean>(true);
  // Variables

  // Methods
  changeState(event: any): void {
    console.log(event);
    this.isSignInViewActive.set(event);
  }

}
