import { Routes } from '@angular/router';

import {
	AuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { TaskManagerComponent } from './tasks-page/task-manager/task-manager.component';
import { SignInComponent } from './authentication/sign-in-page/sign-in.component';

const redirectUnauthorizedToSignIn = () => redirectUnauthorizedTo(['sign-in']);
const redirectLoggedInToTaskManager = () =>
	redirectLoggedInTo(['task-manager']);

export const routes: Routes = [
	{
		path: '',
		redirectTo: '/sign-in',
		pathMatch: 'full',
	},
	{
		path: 'sign-in',
		component: SignInComponent,
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
];
