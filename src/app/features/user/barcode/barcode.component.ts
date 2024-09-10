import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BarcodeSearchService } from '@domain/services/barcode-search/barcodesearch.service';

@Component({
  selector: 'gc-barcode',
  standalone: true,
  imports: [],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css'
})
export class BarcodeComponent implements OnInit {
  // injectors
  activeRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  barcodeSearch = inject(BarcodeSearchService)
  // variables
  barcode: string = '';

  // methods
  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      this.barcode = params.get('barcode')!;
      console.log(this.barcode);
    });
  }

}
