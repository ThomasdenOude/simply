import {
	Component,
	inject,
	OnInit,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';

import { User } from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

import { AuthenticationService } from '../../services/authentication.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { LogoComponent } from '../../../base/ui/logo/logo.component';
import { TextContentDirective } from '../../../base/directives/text-content.directive';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { AuthenticationMessages } from '../../models/authentication-messages';
import {
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
	WELCOME_ROUTE,
} from '../../../base/guards/auth-guards';
import { ConfirmVerifyEmailComponent } from '../../ui/confirm-verify-email/confirm-verify-email.component';
import { ConfirmResetPasswordComponent } from '../../ui/confirm-reset-password/confirm-reset-password.component';

@Component({
	selector: 'simply-authenticate',
	standalone: true,
	imports: [
		CenterPageComponent,
		TextContentDirective,
		LogoComponent,
		MatDivider,
		MatButton,
		MessageComponent,
		RouterLink,
		SpaceContentDirective,
		NewPasswordComponent,
		ConfirmVerifyEmailComponent,
		ConfirmResetPasswordComponent,
	],
	templateUrl: './authenticate.component.html',
	styleUrl: './authenticate.component.scss',
})
export class AuthenticateComponent implements OnInit {
	private _authService: AuthenticationService = inject(AuthenticationService);
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);

	protected user: Signal<User | null> = this._authService.user;
	protected mode: WritableSignal<'verifyEmail' | 'resetPassword' | null> =
		signal(null);

	protected emailCodeConfirmed: WritableSignal<boolean> = signal(false);
	protected emailError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

	private passwordCode: WritableSignal<string | null> = signal(null);
	protected passwordCodeConfirmed: WritableSignal<boolean> = signal(false);
	protected passwordConfirmed: WritableSignal<boolean> = signal(false);
	protected passwordError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);
	protected readonly AuthenticationMessages = AuthenticationMessages;

	ngOnInit() {
		const queryParams: ParamMap = this._route.snapshot.queryParamMap;
		const mode: string | null = queryParams.get('mode');
		const actionCode: string | null = queryParams.get('oobCode');

		if (mode && actionCode) {
			this._sendActionCode(mode, actionCode);
		} else {
			this._redirect();
		}
	}

	private _sendActionCode(mode: string, actionCode: string): void {
		switch (mode) {
			case 'verifyEmail':
				this.mode.set(mode);
				this._confirmEmailVerification(actionCode);
				break;
			case 'resetPassword':
				this.mode.set(mode);
				this._verifyPasswordReset(actionCode);
				this.passwordCode.set(actionCode);
				break;
			default:
				this._redirect();
		}
	}

	private _confirmEmailVerification(actionCode: string): void {
		this._authService
			.confirmEmailVerification(actionCode)
			.then(() => {
				this.emailCodeConfirmed.set(true);
			})
			.catch((error: FirebaseError) => {
				const message = this._authService.getAuthenticationMessage(error);
				this.emailError.set(message);
			})
			.finally(() => {
				this._clearQueryParams();
			});
	}

	protected sendVerificationLink(user: User): void {
		this._authService
			.sendEmailVerification(user)
			.then(() => {
				void this._router.navigate(TASK_BOARD_ROUTE);
			})
			.catch((error: FirebaseError) => {
				const message = this._authService.getAuthenticationMessage(error);
				this.emailError.set(message);
			});
	}

	private _verifyPasswordReset(actionCode: string): void {
		this._authService
			.verifyPasswordReset(actionCode)
			.then(email => {
				this.passwordCodeConfirmed.set(true);
			})
			.catch((error: FirebaseError) => {
				this.passwordError.set(
					this._authService.getAuthenticationMessage(error)
				);
			})
			.finally(() => {
				this._clearQueryParams();
			});
	}

	protected resetPassword(password: string) {
		const actionCode = this.passwordCode();

		if (actionCode) {
			this._authService
				.confirmPasswordReset(actionCode, password)
				.then(() => {
					this.passwordConfirmed.set(true);
				})
				.catch((error: FirebaseError) => {
					this.passwordError.set(
						this._authService.getAuthenticationMessage(error)
					);
				});
		} else {
			this.passwordError.set(AuthenticationMessages.Default);
		}
	}

	private _clearQueryParams(): void {
		// Stay on page but clear queryParams
		void this._router.navigate([], {
			queryParams: {},
		});
	}
	private _redirect(): void {
		const user = this.user();

		if (user) {
			if (user.emailVerified) {
				void this._router.navigate(TASK_BOARD_ROUTE);
			} else {
				void this._router.navigate(VERIFY_EMAIL_ROUTE);
			}
		} else {
			void this._router.navigate(WELCOME_ROUTE);
		}
	}

	protected goToApp(): void {
		if (this.user()) {
			void this._router.navigate(TASK_BOARD_ROUTE);
		} else {
			void this._router.navigate(['/account', 'log-in']);
		}
	}
}
