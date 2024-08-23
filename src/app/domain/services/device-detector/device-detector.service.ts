import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {
  // injectors
  private readonly breakpointObserver = inject(BreakpointObserver);
  // observables
  

  constructor() { }
}
