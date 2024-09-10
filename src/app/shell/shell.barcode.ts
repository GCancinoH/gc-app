import { Route } from '@angular/router';

export const BARCODE_ROUTES: Route[] = [
    {
        path: 'dashboard',
        loadComponent: () => import('../features/user/dashboard/dashboard.component')
            .then(m => m.DashboardComponent),
        title: "Dashboard | GC App",
    }
]