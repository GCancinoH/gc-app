import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { NgFor, JsonPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// Material
// Services
import { BarcodesearchService } from '@domain/services/barcode-search/barcodesearch.service';
import { DeviceDetectorService } from '@domain/services/device-detector/device-detector.service';
// Rxjs
import { BehaviorSubject, finalize } from 'rxjs';
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
  barcodeSearch = inject(BarcodesearchService);
  destroyRef = inject(DestroyRef);
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
  searchingBarcode(barcode: string) {
    // Loading state to true
    this.isLoading.set(true);
    
    this.barcodeSearch.searchInOpenFoodFacts(barcode).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.isLoading.set(false);
      })
    ).subscribe({
      next: (product) => {
        this.productInfo = product;
      },
      error: (error) => {
        console.error('Error searching product:', error);
      }
    });
  }
}
