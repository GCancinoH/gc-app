import { Routes, Route } from '@angular/router';
import { canActivate, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, emailVerified } from '@angular/fire/auth-guard';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedUsers = () => redirectUnauthorizedTo(['/auth']);
const redirectLoggedInUsers = () => redirectLoggedInTo(['/u']);
const redirectVerifiedUsers = () => emailVerified;

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./ui/auth/auth.component').then(c => c.AuthComponent),
        ...canActivate(redirectLoggedInUsers)
    },
    { 'path': '', redirectTo: 'auth', pathMatch: 'full' },
    {
        path: 'auth/next-steps',
        loadComponent: () => import('./ui/auth/next-steps/next-steps.component').then(c => c.NextStepsComponent),
    },
    {
        path: 'auth/authenticate',
        loadComponent: () => import('./ui/auth/authenticate/authenticate.component').then(c => c.AuthenticateComponent)
    },
    {
        path: 'user',
        loadChildren: () => import('./ui/user/user.routes').then(m => m.USER_ROUTES)
    }
    
];


