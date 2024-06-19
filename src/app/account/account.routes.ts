import { Routes } from '@angular/router';
import { AuthGuard } from '@angular/fire/auth-guard';

import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { redirectAfterLogin, redirectNotAuthorized, redirectVerified } from '../base/guards/auth-guards';
import { AuthenticateComponent } from './pages/authenticate/authenticate.component';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'sign-up',
    pathMatch: 'full',
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
    data: { authGuardPipe: redirectVerified }
  },
  {
    path: 'authenticate',
    component: AuthenticateComponent
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectNotAuthorized }
  }
]
