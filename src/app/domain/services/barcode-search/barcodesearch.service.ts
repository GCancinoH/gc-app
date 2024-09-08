import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarcodesearchService {
  // injectors
  private readonly http = inject(HttpClient);
  // variables
  private readonly openFoodFactsApiUrl = 'https://world.openfoodfacts.net/api/v3/product'

  constructor() { }

  searchInOpenFoodFacts(barcode: string): Observable<any> {
    return this.http.get<any>(`${this.openFoodFactsApiUrl}/${barcode}`).pipe(
      map(response => {
        if(response.status === 1) {
          return response.product;
        } else {
          throw new Error('No se encontraron productos con ese código de barras');
        }
      })
    )
  }
}