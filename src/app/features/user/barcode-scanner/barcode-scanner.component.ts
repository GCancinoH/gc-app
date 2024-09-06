import { Component } from '@angular/core';
// Other
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'gc-barcode-scanner',
  standalone: true,
  imports: [ ZXingScannerModule ],
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.css'
})
export class BarcodeScannerComponent {

}
