import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Observable, Subscription, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '@angular/fire/auth';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  // Injects
  authSrv = inject(AuthService);
  destroyRef = inject(DestroyRef);
  router = inject(Router);
  // Variables
  user$!: Observable<User | null>;
  userSubscription!: Subscription;

  ngOnInit(): void {
    this.user$ = this.authSrv.authState$;
  }

  onSignOut() {
    this.authSrv.signOut(); 
    this.router.navigate(['/auth']);
  }
}
