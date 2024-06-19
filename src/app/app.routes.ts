import { Routes } from '@angular/router';

import { AuthGuard } from '@angular/fire/auth-guard';

import { WelcomeComponent } from './account/pages/welcome/welcome.component';
import { redirectAfterLogin, redirectNotAuthorized } from './base/guards/auth-guards';


export const APP_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: WelcomeComponent,
		canActivate: [AuthGuard],
		data: { authGuardPipe: redirectAfterLogin },
	},
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.routes').then(
        mod => mod.ACCOUNT_ROUTES
      ),
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
		path: '**',
		redirectTo: '',
	},
];
