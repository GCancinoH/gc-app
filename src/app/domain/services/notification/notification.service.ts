import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from '../translator/translation.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // injectors
  snackbar = inject(MatSnackBar);
  translator = inject(TranslationService);

  constructor() { }
  showMessage(text: string, duration?: number) {
    this.snackbar.open(text, "Close", {duration: duration});
  }
}
