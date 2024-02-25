import { Routes } from '@angular/router';

import { TaskManagerComponent } from './tasks-page/task-manager/task-manager.component';
import { SignInComponent } from './authentication/sign-in-page/sign-in.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {
        path: 'sign-in',
        component: SignInComponent
    },
    {
        path: 'task-manager',
        loadComponent: () =>
            import('./tasks-page/task-manager/task-manager.component')
                .then((mod) => mod.TaskManagerComponent)
    }
];
