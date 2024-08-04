import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'sign-up',
  standalone: true,
  imports: [],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUpComponent {
  authChangeState = output<boolean>();
  isSignUpActive = signal<boolean>(true);

  onChangeAuthState(): void {
    this.isSignUpActive.set(this.isSignUpActive());
    this.authChangeState.emit(this.isSignUpActive());
  }
}
