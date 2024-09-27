import { JsonPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
// Material
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
// Models
import { Product } from '@domain/models/api/openfoodfacts';
// Services
import { BarcodeAnalysisService } from '@domain/services/barcode-analysis/barcode-analysis.service';
import { BarcodeSearchService } from '@domain/services/barcode-search/barcodesearch.service';
import { PatientService } from '@domain/services/patient/patient.service';
// Observables
import { Observable, finalize } from 'rxjs';
// Other
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { InitialBodyCompositionComponent } from '@shared/dialogs/initial-body-composition/initial-body-composition.component';

@Component({
  selector: 'gc-barcode',
  standalone: true,
  imports: [JsonPipe, MatButton, LottieComponent],
  templateUrl: './barcode.component.html',
  styleUrl: './barcode.component.css'
})
export class BarcodeComponent implements OnInit {
  // injectors
  activeRoute = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  barcodeSearch = inject(BarcodeSearchService);
  barcodeAnalysis = inject(BarcodeAnalysisService);
  patientService = inject(PatientService);
  dialogRef = inject(MatDialog);
  // signals
  isError = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  productInfo = signal<Product | null>(null);
  errorMessage = signal<string>('');
  isErrorInitialData = signal<boolean>(false);
  barcode = signal<string>('');
  isUserHasInitialData = signal<boolean>(false);
  // variables
  lottieError: AnimationOptions = { path: 'images/lottie/warn.json' };
  lottieSearch: AnimationOptions = { path: 'images/lottie/searching.json' };

  // methods
  ngOnInit(): void {
    this.activeRoute.paramMap.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(params => {
      this.barcode.set(params.get('barcode')!);
      this.searchBarcode(this.barcode());
    });
  }

  searchBarcode(barcode: string) {
    // Initialize Loading
    this.isLoading.set(true);
    // Look if user has initial data
    this.isUserHasInitialData.set(this.patientService.doesPatientHasInitialData());
    if (!this.isUserHasInitialData()) {
      this.isLoading.set(false);
      this.isErrorInitialData.set(true);
      return;
    }
    // Search in API or Database
    this.barcodeSearch.searchingBarcode(barcode).pipe(
      finalize(() => {
        this.isLoading.set(false);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (product: Product) => {
        const p: Product = {
          product_name: product.product_name,
          nutriments: product.nutriments
        }
        this.productInfo.set(p);
        this.isLoading.set(false);
      },
      error: (error: Error) => {
        this.isError.set(true);
        this.errorMessage.set(error.message);
        this.isLoading.set(false);
      }
    });
  }

  setInitialBodyComposition() {
    this.dialogRef.open(InitialBodyCompositionComponent, {
      width: '600px',
      disableClose: false
    });
  }
}
