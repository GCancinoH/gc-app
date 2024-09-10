import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { NgFor, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
// Material
// Services
import { DeviceDetectorService } from '@domain/services/device-detector/device-detector.service';
// Rxjs
import { BehaviorSubject } from 'rxjs';
// Other
import { BarcodeFormat } from '@zxing/library';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TranslatePipe } from '@domain/services/translator/translate.pipe';
import { ComposeLoading } from '@compose-ui/loading/loading';

@Component({
  selector: 'gc-barcode-scanner',
  standalone: true,
  imports: [ 
    NgFor, JsonPipe,
    TranslatePipe, ComposeLoading,
    ZXingScannerModule, LottieComponent
  ],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BarcodeScannerComponent implements OnInit {
  // injectors
  deviceDetector = inject(DeviceDetectorService);
  route = inject(Router);
  // signals
  isLoading = signal<boolean>(false);
  // variables
  isMobile: boolean = this.deviceDetector.isMobile();
  isError: boolean = false;
  errorMessage: string = '';
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
  productInfo: any;
  // observables
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  // methods
  ngOnInit(): void {

  }

  /*
    Fn: onCamerasFound
      -> param: devices (MediaDeviceInfo[])
  */
  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }

  /*
    Fn: onDeviceSelectChange
      -> param: selected (string)
  */
  onDeviceSelectChange(selected: string) {
    const selectedStr = selected || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.deviceCurrent = device || undefined;
  }

  /*
    Fn: onDeviceChange
      -> param: device (MediaDeviceInfo)
  */
  onDeviceChange(device: MediaDeviceInfo) {
    const selectedStr = device?.deviceId || '';
    if (this.deviceSelected === selectedStr) { return; }
    this.deviceSelected = selectedStr;
    this.deviceCurrent = device || undefined;
  }

  /*
    Fn: onCodeResult
      -> param: result (string)
  */
  onCodeResult(result: string) {
    this.codeResult = result;
    if(this.codeResult != '') {
      //this.searchingBarcode(this.codeResult);
      this.route.navigate(['/barcode', this.codeResult]);
    }
  }

  /*
    Fn: onHasPermissions
      -> param: has (boolean)
  */
  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  /*
    Fn: onTorchCompatible
      -> param: isCompatible (boolean)
  */
  onScanError(error: Error) {
    this.isError = true;
    this.errorMessage = error.message;
    this.isLoading.set(false);
  }

  /*
    Fn: onTorchCompatible
      -> param: isCompatible (boolean)
  */
  onTorchCompatible(isCompatible: boolean): void {
    if (isCompatible) {
      this.torchAvailable$.next(true);
    } else {
      console.warn('Torch not compatible or available.');
      this.torchAvailable$.next(false);
    }
  }
}
