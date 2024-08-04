import { Component, output, signal } from '@angular/core';

@Component({
  selector: 'sign-in',
  standalone: true,
  imports: [],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignInComponent {
  loadingState = output<boolean>();
  isSignInActive = signal<boolean>(true);

  onChangeState() {
    this.isSignInActive.update(state => !state);
    this.loadingState.emit(this.isSignInActive());
  }
  
}
