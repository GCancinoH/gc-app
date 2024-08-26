import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
// Material
import { MatToolbar } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';

interface NavLinks {
  name: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'gc-user',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbar, MatSidenavModule, MatButton, MatFabButton, MatIcon, MatIconButton,
    MatMenuModule, MatNavList, MatListItem, MatListItemIcon, MatListItemTitle
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  // injectors
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);
  // variables
  navLinks!: NavLinks[];

  constructor() {
    this.navLinks = [
      {
        name: 'Dashboard',
        route: '/u/dashboard',
        icon: 'dashboard'
      },
      {
        name: 'Nutricion',
        route: '/u/settings',
        icon: 'nutrition'
      },
      {
        name: 'Entrenamiento',
        route: '/u/profile',
        icon: 'exercise'
      }
    ]
  }
}
