import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Observable, Subscription, first, map, of, shareReplay, switchMap, take } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User, user } from '@angular/fire/auth';
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
import { traceUntilFirst } from '@angular/fire/performance';
import { DocumentData, Firestore, Timestamp, collection, collectionChanges, collectionData, collectionSnapshots, getDocs, onSnapshot, query, where } from '@angular/fire/firestore';
import { ComposeInfoCard } from '@core/components/info-cards/info-cards.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
    DashboardToolbar, SidenavContent, ComposeInfoCard
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
  db = inject(Firestore);
  // Variables
  isAdmin = signal<boolean>(false);
  isSidenavCollapsed = signal<boolean>(false);
  showWeightReminder = signal<boolean>(true);
  // Computed
  sideNavWidth = computed(() => {
    return this.isSidenavCollapsed() ? '65px' : '250px';
  });
  user$!: Observable<User | null>;
  public bodyCompDocExists$!: Observable<any>;

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

  constructor() {
    effect(() => {
      this.authSrv.authState$.pipe(
        shareReplay(1),
        switchMap((user: User | null) => user ? this.checkIfBodyCompDocExists(user.uid) : of(false))
      ).pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe((exists: boolean) => {
        this.showWeightReminder.set(exists);
      });
    })
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

  checkIfBodyCompDocExists(uid: string): Observable<boolean> {
    console.log("User ID: ", uid);
    const startOfDay = Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)));
    const endOfDay = Timestamp.fromDate(new Date(new Date().setHours(23, 59, 59, 999)));
    const collectionRef = collection(this.db, 'bodyComposition');
    const bodyCompQuery = query(collectionRef, 
      where('uid', '==', uid),
      where('date', '>=' , startOfDay),
      where('date', '<=', endOfDay)
    );

    return new Observable<boolean>((observer) => {
      const unsubscribe = onSnapshot(bodyCompQuery, (snapshot) => {
        observer.next(!snapshot.empty); 
      });
      return () => unsubscribe(); // Cleanup on observable completion/unsubscription
    });
  }

}
