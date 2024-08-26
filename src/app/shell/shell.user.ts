import { canActivate } from '@angular/fire/auth-guard';
import { Route } from '@angular/router';
import { redirectAuthorizedUsersTo } from './shell.guards';

export const USER_ROUTES: Route[] = [
    {
        path: 'dashboard',
        loadComponent: () => import('../features/user/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: "Dashboard | GC App",
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
];