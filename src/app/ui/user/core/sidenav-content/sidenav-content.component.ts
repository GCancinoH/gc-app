import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgStyle } from '@angular/common';

interface  SidenavMenu {
  name: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'sidenav-content',
  standalone: true,
  imports: [
    RouterLinkActive, RouterLink, NgStyle,
    MatListModule, MatIcon
  ],
  templateUrl: './sidenav-content.component.html',
  styleUrl: './sidenav-content.component.css'
})
export class SidenavContent implements OnInit {
  // Inputs
  userPhoto = input<string | null | undefined>(null);
  userName = input<string | null | undefined>(null);
  isAdmin = input<boolean>(false);
  isCollapsed = input<boolean>(false);
  profilePicture = computed(() => {
    return this.isCollapsed() ? '32px' : '100px';
  });
  // Variables
  fullName = computed(() => {
    const userNameValue = this.userName();
    return userNameValue ? this.getInitials(userNameValue) : null;
  });
  items = signal<SidenavMenu[]>([
    {
      name: 'Administración',
      icon: 'shield_person',
      route: 'inner'
    },
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard'
    },
    {
      name: 'Weight',
      icon: 'monitor_weight',
      route: 'weight-logger'
    },
    {
      name: 'Training Plan',
      icon: 'exercise',
      route: 'training'
    },
    {
      name: 'Nutrition Plan',
      icon: 'nutrition',
      route: 'nutrition-plan'
    }
  ]);


  ngOnInit(): void {
  }

  getInitials(val: string): string {
    const names = val.split(' ');
    let initials = '';
    names.forEach(n => {
      initials += n.charAt(0).toUpperCase();
    });
    return initials;
  }
}
