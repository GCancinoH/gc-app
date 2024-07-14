import { Component, OnInit, inject } from '@angular/core';
import { Auth, applyActionCode } from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  standalone: true,
  imports: [],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.css'
})
export class AuthenticateComponent implements OnInit {
  queryStrings = inject(ActivatedRoute);
  auth = inject(Auth);
  snackbar = inject(MatSnackBar);
  router = inject(Router);         

  ngOnInit(): void {
    this.queryStrings.queryParams.subscribe(params => {
      const mode = params['mode'];
      const oobCode = params['oobCode'];
      const apiKey = params['apiKey'];

      if (mode === 'verifyEmail') {
        this.verifyEmail(oobCode).then(() => {
          this.snackbar.open('Email verified successfully', 'Dismiss', {duration: 3500});
          this.router.navigate(['/auth']);
        }).catch((error) => {
          this.snackbar.open('Error verifying email', 'Dismiss', {duration: 3500});
          console.error('Error verifying email:', error);
        });
      }

    });
  }

  verifyEmail(code: string) {
    return applyActionCode(this.auth, code);
  }
  
}
