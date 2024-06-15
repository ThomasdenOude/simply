import { Routes } from '@angular/router';

import { AuthGuard } from '@angular/fire/auth-guard';

import { WelcomeComponent } from './user-management/pages/welcome/welcome.component';
import { SignUpComponent } from './user-management/pages/sign-up/sign-up.component';
import { LoginComponent } from './user-management/pages/login/login.component';
import { redirectAfterLoginGenerator, redirectNotAuthorizedGenerator, redirectVerifiedGenerator } from './user-management/guards/auth-guards';
import { VerifyEmailComponent } from './user-management/pages/verify-email/verify-email.component';

const redirectAfterLogin = () => redirectAfterLoginGenerator(['task-board', 'verify-email'])
const redirectNotAuthorized = () => redirectNotAuthorizedGenerator(['', 'verify-email'])
const redirectVerified = () => redirectVerifiedGenerator(['task-board', ''])

export const APP_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: WelcomeComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectAfterLogin },
	},
	{
		path: 'sign-up',
		component: SignUpComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectAfterLogin },
	},
	{
		path: 'log-in',
		component: LoginComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectAfterLogin },
	},
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectVerified },
  },
	{
		path: 'task-board',
		loadChildren: () =>
			import('./task-board/task-board.routes').then(
				mod => mod.TASK_BOARD_ROUTES
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectNotAuthorized },
	},
	{
		path: 'settings',
		loadComponent: () =>
			import('./user-management/pages/settings/settings.component').then(
				mod => mod.SettingsComponent
			),
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectNotAuthorized },
	},
	{
		path: '**',
		redirectTo: '',
	},
];
