import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gc-main-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class MainHero {
  // injectors
  router = inject(Router);
  
  // methods
  goToSignIn() {
    this.router.navigate(['/auth/authenticate']);
  }
}
