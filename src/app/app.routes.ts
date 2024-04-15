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

const redirectUnauthorizedToSignUp = () => redirectUnauthorizedTo(['']);
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
		data: { authGuardPipe: redirectUnauthorizedToSignUp },
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./user-management/components/settings/settings.component').then(
				mod => mod.SettingsComponent
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignUp },
	},
	{
		path: '**',
		redirectTo: '',
	},
];
