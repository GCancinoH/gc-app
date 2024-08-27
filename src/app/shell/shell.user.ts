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
        path: 'nutrition-label-analysis',
        loadComponent: () => import('../features/user/nutrition-label-analysis/nutrition-label-analysis.component')
            .then(m => m.NutritionLabelAnalysisComponent),
        title: "Nutrition Label Analysis | GC App",
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
];