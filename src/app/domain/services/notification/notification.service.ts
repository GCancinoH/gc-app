import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslationService } from '../translator/translation.service';
import { ToastrService } from 'ngx-toastr';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // injectors
  private readonly _snackbar = inject(MatSnackBar);
  private readonly _translator = inject(TranslationService);
  private readonly _toastr = inject(ToastrService);

  constructor() { }
  showMessage(text: string, duration?: number) {
    this._snackbar.open(text, "Close", {duration: duration});
  }

  showToastrNotification(message: string, title?: string, type?: NotificationType)
  {
    switch(type) {
      case 'success':
        this._toastr.success(message, title);
        break;
      case 'info':
        this._toastr.info(message, title);
        break;
      case 'warning':
        this._toastr.warning(message, title);
        break;
      case 'error':
        this._toastr.error(message, title);
        break;
    }
  }
}
