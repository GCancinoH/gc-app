import { Directive, ElementRef, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from '@domain/services/device-detector/device-detector.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[gcResponsive]',
  standalone: true
})
export class ResponsiveDirective implements OnInit {

  // injectors
  private displayService = inject(DeviceDetectorService);
  elementRef = inject(ElementRef);
  // observable - suscriptions
  private subscription!: Subscription;

  // methods
  ngOnInit(): void {
    this.subscription = this.displayService.getDeviceClass().subscribe(deviceClass => {
      this.elementRef.nativeElement.classList.remove('desktop', 'tablet', 'mobile');
      this.elementRef.nativeElement.classList.add(deviceClass);
    });
  }
}
