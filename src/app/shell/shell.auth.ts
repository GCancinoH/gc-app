import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
    {
        path: 'authenticate',
        loadComponent: () => import('../features/auth/authenticate/authenticate.component')
            .then(m => m.AuthenticateComponent),
        title: "Autenticación | GC App"
    },
    {
        path: 'email-verificate',
        loadComponent: () => import('../features/auth/email-verificate/email-verificate.component')
            .then(m => m.EmailVerificateComponent),
    },
    {
        path: 'email-verification',
        loadComponent: () => import('../features/auth/email-verification/email-verification.component')
            .then(m => m.EmailVerificationComponent),
    },
    {
        path: 'reset-password',
        loadComponent: () => import('../features/auth/reset-password/reset-password.component')
            .then(m => m.ResetPasswordComponent),
    },
    {
        path: 'next-steps',
        loadComponent: () => import('../features/auth/next-steps/next-steps.component')
            .then(m => m.NextStepsComponent),
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'authenticate',
    },
];