import { Routes } from '@angular/router';

import {
	AuthGuard,
	redirectUnauthorizedTo,
	redirectLoggedInTo,
} from '@angular/fire/auth-guard';

import { WelcomeComponent } from './user-management/view/welcome-page/welcome.component';
import { SignUpComponent } from './user-management/view/sign-up-page/sign-up.component';
import { LoginComponent } from './user-management/view/login-page/login.component';

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
			import('./tasks-board/view/task-board-page/task-board.component').then(
				mod => mod.TaskBoardComponent
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectUnauthorizedToSignUp },
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./user-management/view/settings-page/settings.component').then(
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
