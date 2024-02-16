import { Routes } from '@angular/router';

import { TaskManagerComponent } from './components/task-manager/task-manager.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/task-manager',
        pathMatch: 'full',
    },
    {
        path: 'task-manager',
        loadComponent: () =>
            import('./components/task-manager/task-manager.component')
                .then((mod) => mod.TaskManagerComponent)
    }
];
