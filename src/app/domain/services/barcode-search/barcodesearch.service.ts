import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
// Observables
import { Observable, catchError, from, map, of, switchMap } from 'rxjs';
// Others
import { Product } from '@domain/models/api/openfoodfacts';

@Injectable({
  providedIn: 'root'
})
export class BarcodeSearchService {
  // injectors
  private readonly http = inject(HttpClient);
  private readonly db = inject(Firestore);
  // variables
  private readonly openFoodFactsApiUrl = 'https://world.openfoodfacts.net/api/v3/product'

  constructor() { }

  searchingBarcode(barcode: string): Observable<Product> {
    return this.searchInDatabase(barcode).pipe(
      switchMap(databaseResult => {
        if (databaseResult) {
          return of(databaseResult);
        } else {
          return this.searchInOpenFoodFacts(barcode);
        }
      })
    );
  }

  private searchInOpenFoodFacts(barcode: string): Observable<Product> {
    return this.http.get<any>(`${this.openFoodFactsApiUrl}/${barcode}`).pipe(
      map(response => {
        if(response.status === 'success') {
          return response.product;
        } else {
          throw new Error('No se encontraron productos con ese código de barras');
        }
      })
    )
  }

  private searchInDatabase(barcode: string): Observable<Product | null> {
    const productRef = doc(this.db, 'products', barcode);
    return from(getDoc(productRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return docSnapshot.data() as Product;
        } else {
          return null;
        }
      }),
      catchError(error => {
        console.error('Error searching in database:', error);
        return of(null);
      })
    );
  }
}