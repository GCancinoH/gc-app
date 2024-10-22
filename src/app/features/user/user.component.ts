import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, viewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AsyncPipe } from '@angular/common';
// Material
import { MatToolbar } from '@angular/material/toolbar';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatIcon, MatIconRegistry } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatListItem, MatListItemIcon, MatListItemTitle, MatNavList } from '@angular/material/list';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatBadgeModule } from '@angular/material/badge';
// Other
import { DeviceDetectorService } from '@domain/services/device-detector/device-detector.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { BodyCompositionSheetComponent } from '@shared/sheets/body-composition-sheet/body-composition-sheet.component';
import { BloodPressureSheetComponent } from '@shared/sheets/blood-pressure-sheet/blood-pressure-sheet.component';
import { AuthService } from '@domain/services/auth/auth.service';

interface NavLinks {
  name: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'gc-user',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe,
    MatToolbar, MatSidenavModule, MatButton, MatFabButton, MatIcon, MatIconButton,
    MatMenuModule, MatNavList, MatListItem, MatListItemIcon, MatListItemTitle,
    MatBadgeModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent implements OnInit {
  // injectors
  iconRegistry = inject(MatIconRegistry);
  sanitizer = inject(DomSanitizer);
  device = inject(DeviceDetectorService);
  destroyRef = inject(DestroyRef);
  bottomSheet = inject(MatBottomSheet);
  authService = inject(AuthService);
  private readonly _router = inject(Router);
  // inputs, outputs, viewchilds, etc
  drawerEl = viewChild<MatDrawer>('drawer');
  // signals
  navbarOpened$ = new Subject<boolean>;
  // variables
  navLinks!: NavLinks[];

  ngOnInit(): void {
    this.navbarOpened$.next(true);

    this.device.getDeviceClass().pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(700)
    ).subscribe(device => {
      if(device == 'mobile') {
        this.navbarOpened$.next(false);
      } else {
        this.navbarOpened$.next(true);
      }
    });
  }
  
  constructor() {
    this.navLinks = [
      {
        name: 'Dashboard',
        route: '/u/dashboard',
        icon: 'dashboard'
      },
      {
        name: 'Nutricion',
        route: '/u/nutrition',
        icon: 'nutrition'
      },
      {
        name: 'Entrenamiento',
        route: '/u/training',
        icon: 'exercise'
      },
      {
        name: 'Lector Código de Barras',
        route: '/u/barcode-scanner',
        icon: 'barcode-scanner'
      },
      {
        name: 'Análisis de Etiqueta',
        route: '/u/nutrition-label-analysis',
        icon: 'search_insights'
      }
    ]
  }

  closeIfMobile(): void {
    let result = false;
    this.device.getDeviceClass().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(device => {
      if(device) {
        if(device == 'mobile') {
          const drawer = this.drawerEl();
          drawer?.close();
        } else {
          return;
        }
      }      
    });
  }

  userSignOut(): void {
    this.authService.signOut().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(sucess => {
      if(sucess) {
        this._router.navigate(['/auth']);        
      } else {
        console.log('Error signing out');
      }
    });
  }

  openBodyCompositionSheet(): void {
    this.bottomSheet.open(BodyCompositionSheetComponent, {
      panelClass: 'bottom-sheets',
    });
  }

  openBloodPressureSheet(): void {
    this.bottomSheet.open(BloodPressureSheetComponent, {
      panelClass: 'bottom-sheets'
    });
  }
}
