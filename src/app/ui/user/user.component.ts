import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from '@angular/fire/auth';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { SidenavContent } from '@features/user/core/sidenav-content/sidenav-content.component';
import { Observable } from 'rxjs';
import { SaveBodyCompositionSheet } from './core/saveBodyComposition/save-body-composition';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterOutlet, AsyncPipe,
    MatToolbar, MatIconButton, MatSidenavContainer, MatSidenav, MatSidenavContent,
    MatIcon, MatFabButton, MatMenuModule,
    SidenavContent
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit
{

  // Injects
  authSrv = inject(AuthService);
  destroyRef = inject(DestroyRef);
  bottomSheet = inject(MatBottomSheet);
  // Signals
  isAdmin = signal<boolean>(false);
  isSidenavCollapsed = signal<boolean>(false);
  // Computed
  sideNavWidth = computed(() => {
    return this.isSidenavCollapsed() ? '65px' : '250px';
  })
  // Observables
  user$!: Observable<User | null>;

  // Methods
  ngOnInit(): void {
    // Getting the user
    this.user$ = this.authSrv.authState$;
  }

  constructor() {
    effect(() => {
      this.authSrv.getCustomClaims().subscribe({
        next: (user: any) => {
          user.getIdTokenResult().then((idTokenResult: any) => {
            const customClaims = idTokenResult.claims;
            if(customClaims.admin === true) {
              this.isAdmin.set(true);
            }
          });
        }
      });
    });
  }

  openAddWeightBottomSheet(): void { this.bottomSheet.open(SaveBodyCompositionSheet) }

}
