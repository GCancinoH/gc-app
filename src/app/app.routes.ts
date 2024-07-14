import { Routes } from '@angular/router';
import { userGuard } from './core/guards/user-guard.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./ui/auth/auth.component').then(c => c.AuthComponent),
        canActivate: [userGuard]
    },
    {
        'path': '', redirectTo: 'auth', pathMatch: 'full'
    },
    {
        path: 'u/dashboard',
        loadComponent: () => import('./ui/user/dashboard/dashboard.component').then(c => c.DashboardComponent),
        canActivate: [userGuard]
    },
    {
        path: 'auth/next-steps',
        loadComponent: () => import('./ui/auth/next-steps/next-steps.component').then(c => c.NextStepsComponent),
    },
    {
        path: 'auth/authenticate',
        loadComponent: () => import('./ui/auth/authenticate/authenticate.component').then(c => c.AuthenticateComponent)
    }

];
