import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    
private isOnlineSubject: BehaviorSubject<boolean>;
  isOnline$: Observable<boolean>;

  constructor() {
    this.isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
    this.isOnline$ = this.isOnlineSubject.asObservable();

    window.addEventListener('online', this.updateNetworkStatus.bind(this));
    window.addEventListener('offline', this.updateNetworkStatus.bind(this));
  }

  private updateNetworkStatus() {
    this.isOnlineSubject.next(navigator.onLine)
  }
}