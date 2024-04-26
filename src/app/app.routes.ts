import { Routes } from '@angular/router';

import {
	AuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { WelcomeComponent } from './user-management/pages/welcome/welcome.component';
import { SignUpComponent } from './user-management/pages/sign-up/sign-up.component';
import { LoginComponent } from './user-management/pages/login-page/login.component';

const redirectUnauthorizedToSignUp = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToTaskBoard = () => redirectLoggedInTo(['task-board']);

export const APP_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
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
		loadChildren: () =>
			import('./task-board/task-board.routes').then(
				mod => mod.TASK_BOARD_ROUTES
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignUp },
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./user-management/pages/settings-page/settings.component').then(
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
