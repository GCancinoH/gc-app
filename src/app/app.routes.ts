import { Routes, Route } from '@angular/router';
import { canActivate, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, emailVerified } from '@angular/fire/auth-guard';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedUsers = () => redirectUnauthorizedTo(['/auth']);
const redirectLoggedInUsers = () => redirectLoggedInTo(['/u/dashboard']);
const redirectVerifiedUsers = () => emailVerified;

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./shell/shell.auth').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        loadComponent: () => import('./features/main/main/main.component').then(c => c.MainComponent)
    }
    //{ 'path': '', redirectTo: 'auth', pathMatch: 'full' },
    /*{
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
        path: 'u',
        loadComponent: () => import('./ui/user/user.component').then(c => c.UserComponent),
        loadChildren: () => import('./ui/user/user.routes').then(m => m.USER_ROUTES),
        ...canActivate(redirectUnauthorizedUsers),
        ...canActivate(redirectVerifiedUsers)
    }
*/    
];


