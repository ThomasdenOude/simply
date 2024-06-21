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
	],
	templateUrl: './authenticate.component.html',
	styleUrl: './authenticate.component.scss',
})
export class AuthenticateComponent implements OnInit {
	private _authService: AuthenticationService = inject(AuthenticationService);
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);

	protected user: Signal<User | null> = this._authService.user;
	private email: WritableSignal<string | null> = signal(null);
	protected mode: WritableSignal<'verifyEmail' | 'resetPassword' | null> =
		signal(null);
	private actionCode: WritableSignal<string | null> = signal(null);
	protected continue: WritableSignal<boolean> = signal(false);
	protected passwordConfirmed: WritableSignal<boolean> = signal(false);
	protected errorMessage: WritableSignal<AuthenticationMessages> = signal(
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
				this.actionCode.set(actionCode);
				this.confirmEmailVerification(actionCode);
				break;
			case 'resetPassword':
				this.mode.set(mode);
				this.actionCode.set(actionCode);
				this.verifyPasswordReset(actionCode);
				break;
			default:
				this._redirect();
		}
	}

	private confirmEmailVerification(actionCode: string): void {
		this._authService
			.confirmEmailVerification(actionCode)
			.then(() => {
				this.continue.set(true);
			})
			.catch((error: FirebaseError) => {
				const message = this._authService.getAuthenticationMessage(error);
				this.errorMessage.set(message);
			})
			.finally(() => {
				// Clear queryParams
				void this._router.navigate([], {
					queryParams: {},
				});
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
				this.errorMessage.set(message);
			});
	}

	private verifyPasswordReset(actionCode: string): void {
		this._authService
			.verifyPasswordReset(actionCode)
			.then(email => {
				this.continue.set(true);
				this.email.set(email);
			})
			.catch((error: FirebaseError) => {
				this.errorMessage.set(
					this._authService.getAuthenticationMessage(error)
				);
			});
	}

	protected resetPassword(password: string) {
		const actionCode = this.actionCode();

		if (actionCode) {
			this._authService
				.confirmPasswordReset(actionCode, password)
				.then(() => {
					this.passwordConfirmed.set(true);
				})
				.catch((error: FirebaseError) => {
					this.errorMessage.set(
						this._authService.getAuthenticationMessage(error)
					);
				});
		} else {
			this.errorMessage.set(AuthenticationMessages.Default);
		}
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

	protected gotToApp(): void {
		const user = this._authService.user();

		if (user) {
			void this._router.navigate(TASK_BOARD_ROUTE);
		} else {
			void this._router.navigate(['/account', 'log-in']);
		}
	}
}
