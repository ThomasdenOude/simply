import { Routes } from '@angular/router';

import {
	AuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { TaskManagerComponent } from './tasks-page/task-manager/task-manager.component';
import { SignUpComponent } from './user-management/sign-up-page/sign-up.component';

const redirectUnauthorizedToSignIn = () =>
	redirectUnauthorizedTo(['user-management']);
const redirectLoggedInToTaskManager = () =>
	redirectLoggedInTo(['task-manager']);

export const routes: Routes = [
	{
		path: '',
		component: SignUpComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectLoggedInToTaskManager },
	},
	{
		path: 'task-manager',
		loadComponent: () =>
			import('./tasks-page/task-manager/task-manager.component').then(
				mod => mod.TaskManagerComponent
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignIn },
	},
	{
		path: '**',
		redirectTo: '',
	},
];
