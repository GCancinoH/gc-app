import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, fromEvent, map } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    
  private online$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.initializeNetworkObservables();
  }

  get isOnline$(): Observable<boolean> {
    return this.online$.asObservable();
  }

  get isOnline(): boolean {
    return navigator.onLine;
  }

  private initializeNetworkObservables(): void {
    fromEvent(window, 'online').pipe(
      map(() => true)
    ).subscribe(this.online$);

    fromEvent(window, 'offline').pipe(
      map(() => false)
    ).subscribe(this.online$);
  }
}