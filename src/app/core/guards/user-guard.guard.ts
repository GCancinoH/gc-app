import { DestroyRef, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { map, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { user } from '@angular/fire/auth';

export const userGuard: CanActivateFn = (route, state) => {
  //return true;
  const authSrv = inject(AuthService);
  const destroyRef = inject(DestroyRef);  
  const router = inject(Router);

  return authSrv.authState$.pipe(
    takeUntilDestroyed(destroyRef)
  ).subscribe((user: any) => {
    if(user) {
      router.navigate(['/u/dashboard']);
      return true;
    } else {
      router.navigate(['/auth']);
      return false;
    }
  })
};
