import { Component, computed, effect, input, OnInit, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';

interface  SidenavMenu {
  name: string;
  icon: string;
  route?: string;
}

@Component({
  selector: 'sidenav-content',
  standalone: true,
  imports: [
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
  // Variables
  fullName = computed(() => {
    const userNameValue = this.userName();
    return userNameValue ? this.getInitials(userNameValue) : null;
  });
  items = signal<SidenavMenu[]>([
    {
      name: 'Administrador',
      icon: 'shield_person',
      route: 'admin'
    },
    {
      name: 'Dashboard',
      icon: 'dashboard',
      route: 'dashboard'
    },
    {
      name: 'Weight',
      icon: 'monitor_weight',
      route: 'clientes'
    },
    {
      name: 'Training Plan',
      icon: 'exercise',
      route: 'workout'
    },
    {
      name: 'Nutrition Plan',
      icon: 'nutrition',
      route: 'nutrition'
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
