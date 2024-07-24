import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '@angular/fire/auth';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardToolbar } from './utils/toolbar/toolbar.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavContent } from './utils/sidenav-content/sidenav-content.component';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AddWeightComponent } from './features/core/bottom-sheets/add-weight/add-weight.component';
import { TitleService } from '@core/title/title.service';

export interface UserInfo {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  phoneNumber: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    JsonPipe, AsyncPipe,
    MatSidenavModule, MatFabButton, MatIcon, MatMenuModule,
    DashboardToolbar, SidenavContent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Injects
  authSrv = inject(AuthService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  bottomSheet = inject(MatBottomSheet);
  title = inject(TitleService);
  // Variables
  isAdmin = signal<boolean>(false);
  isSidenavCollapsed = signal<boolean>(false);
  sideNavWidth = computed(() => {
    return this.isSidenavCollapsed() ? '65px' : '250px';
  });

  // Variables
  user$!: Observable<User | null>;
  userSubscription!: Subscription;

  ngOnInit(): void {
    // Set title
    this.title.setTitle('Dashboard');
    // Get user state
    this.user$ = this.authSrv.authState$;
    // Get user custom claims
    this.authSrv.getCustomClaims().subscribe({
      next: (user: any) => {
        user.getIdTokenResult().then((idTokenResult: any) => {
          const customClaims = idTokenResult.claims;
          if(customClaims.admin === true) {
            this.isAdmin.set(true);
          }
        }).catch((error: any) => {
          console.error("Error fetching ID token result:", error);
        });
      },
      error: (err: any) => {
        console.error("Error fetching custom claims:", err);
      },
      complete: () => {
        console.log("Custom claims fetch completed");
      }
    });
  }

  onSignOut() {
    this.authSrv.signOut(); 
    this.router.navigate(['/auth']);
  }

  onToggleSidenav(collapsed: boolean) {
    this.isSidenavCollapsed.set(collapsed);
  }

  openAddWeightBottomSheet() {
    this.bottomSheet.open(AddWeightComponent);
  }
}
