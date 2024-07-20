import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { Observable, Subscription, switchMap, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '@angular/fire/auth';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardToolbar } from './utils/toolbar/toolbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    JsonPipe, AsyncPipe,
    DashboardToolbar
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Injects
  authSrv = inject(AuthService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  isAdmin = signal<boolean>(false);

  // Variables
  user$!: Observable<User | null>;
  userSubscription!: Subscription;

  ngOnInit(): void {
    this.user$ = this.authSrv.authState$;
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
}
