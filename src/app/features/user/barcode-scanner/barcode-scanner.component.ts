import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { BarcodeFormat } from '@zxing/library';
// Material

// Other
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BehaviorSubject } from 'rxjs';
import { DeviceDetectorService } from '@domain/services/device-detector/device-detector.service';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';
import { ComposeLoading } from '@compose-ui/loading/loading.component';

@Component({
  selector: 'gc-barcode-scanner',
  standalone: true,
  imports: [ 
    NgFor, 
    TranslatePipe, ComposeLoading,
    ZXingScannerModule, LottieComponent
  ],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent implements OnInit {
  // injectors
  deviceDetector = inject(DeviceDetectorService);
  // variables
  isMobile: boolean = this.deviceDetector.isMobile();
  isLoading: boolean = false;
  availableDevices!: MediaDeviceInfo[];
  deviceCurrent: MediaDeviceInfo | undefined;
  deviceSelected!: string;
  allowedFormats: BarcodeFormat[] = [ BarcodeFormat.EAN_13, BarcodeFormat.CODE_128, BarcodeFormat.DATA_MATRIX, BarcodeFormat.EAN_8 ];
  codeResult: string = '';
  hasPermission!: boolean;
  hasDevices!: boolean;
  torchEnabled = false;
  tryHarder = false;
  options: AnimationOptions = {
    path: 'images/lottie/warn.json',
  };

  // observables
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  
  ngOnInit(): void {

  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  onCodeResult(result: string) {
    this.codeResult = result;
    if(this.codeResult != '') {
      this.searchingBarcode(this.codeResult);
    }
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible: boolean): void {
    if (isCompatible) {
      this.torchAvailable$.next(true);
    } else {
      console.warn('Torch not compatible or available.');
      this.torchAvailable$.next(false);
    }
  }

  /* */
  private searchingBarcode(barcode: string) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }



}
