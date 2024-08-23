import { Injectable, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {
  // injectors
  private readonly breakpointObserver = inject(BreakpointObserver);
  // observables
  private readonly deviceClass$: Observable<string>;

  constructor() {
    this.deviceClass$ = this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait, Breakpoints.Web])
      .pipe(
        map(result => {
          if (result.breakpoints[Breakpoints.HandsetPortrait]) {
            return 'mobile';
          }
          if (result.breakpoints[Breakpoints.TabletPortrait]) {
            return 'tablet';
          }
          return 'desktop';
        }),
        shareReplay(1)
      );
  }

  getDeviceClass(): Observable<string> {
    return this.deviceClass$;
  }
}
