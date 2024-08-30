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
        path: 'barcode-scanner',
        loadComponent: () => import('../features/user/barcode-scanner/barcode-scanner.component')
            .then(m => m.BarcodeScannerComponent),
        title: "Barcode Scanner | GC App",
    },
    {
        path: 'nutrition',
        loadComponent: () => import('../features/user/nutrition/nutrition.component')
            .then(m => m.NutritionComponent),
        title: "Nutrition | GC App",
    },
    {
        path: 'training',
        loadComponent: () => import('../features/user/training/training.component')
            .then(m => m.TrainingComponent),
        title: "Training | GC App",
    },
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
    },
];