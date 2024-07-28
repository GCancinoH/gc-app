import { Route } from '@angular/router';

export const USER_ROUTES: Route[] = [
    {
        path: 'nutrition-plan',
        loadComponent: () => import('./nutrition-plan/nutrition-plan.component').then(c => c.NutritionPlanComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent)
    },
];