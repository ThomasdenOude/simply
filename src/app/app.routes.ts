import { Routes } from '@angular/router';

import {
	AuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { TaskManagerComponent } from './tasks-page/task-manager/task-manager.component';
import { WelcomeComponent } from './user-management/welcome/welcome.component';
import { SignUpComponent } from './user-management/components/sign-up/sign-up.component';
import { LoginComponent } from './user-management/components/login/login.component';

const redirectUnauthorizedToSignIn = () =>
	redirectUnauthorizedTo(['user-management']);
const redirectLoggedInToTaskBoard = () => redirectLoggedInTo(['task-board']);

export const routes: Routes = [
	{
		path: '',
		component: WelcomeComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectLoggedInToTaskBoard },
	},
	{
		path: 'sign-up',
		component: SignUpComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectLoggedInToTaskBoard },
	},
	{
		path: 'log-in',
		component: LoginComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectLoggedInToTaskBoard },
	},
	{
		path: 'task-board',
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
