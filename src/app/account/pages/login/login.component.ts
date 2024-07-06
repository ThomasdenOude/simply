import {
	Component,
	inject,
	OnDestroy,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FirebaseError } from '@firebase/util';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { ForgotPasswordComponent } from '../../ui/forgot-password/forgot-password.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import {
	BaseCredentials,
	BaseCredentialsForm,
} from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import {
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
} from '../../../base/guards/auth-guards';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'simply-login',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		MatIcon,
		MessageComponent,
		CenterPageComponent,
		FocusInputDirective,
		SpaceContentDirective,
		RouterLink,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
	private destroy: Subject<void> = new Subject<void>();

	private authService: AuthenticationService = inject(AuthenticationService);
	private navigationService: NavigationService = inject(NavigationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);
	private dialog: Dialog = inject(Dialog);
	private snackbar: MatSnackBar = inject(MatSnackBar);

	private browserTabReturned$: Observable<null> =
		this.navigationService.browserTabReturned$;

	protected readonly AuthenticationErrors = AuthenticationMessages;
	protected loginError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected loginForm: FormGroup<BaseCredentialsForm> =
		new FormGroup<BaseCredentialsForm>({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
		});

	protected login(): void {
		if (this.loginForm.valid) {
			const user: Partial<BaseCredentials> = this.loginForm.value;
			const email = user.email;
			const password = user.password;

			if (email && password) {
				this.authService
					.loginAndVerifyEmail(email, password)
					.then((emailVerified: boolean | void) => {
						// Signed in
						if (emailVerified) {
							void this.router.navigate(TASK_BOARD_ROUTE);
						} else {
							void this.router.navigate(VERIFY_EMAIL_ROUTE);

							this.browserTabReturned$
								.pipe(takeUntil(this.destroy))
								.subscribe(() => {
									void this.router.navigate(TASK_BOARD_ROUTE);
								});
						}
					})
					.catch((error: FirebaseError) => {
						this.loginError.set(
							this.authService.getAuthenticationMessage(error)
						);
					});
			}
		}
	}

	protected resetError() {
		this.loginError.set(AuthenticationMessages.None);
	}

	protected openForgotPasswordDialog(): void {
		const forgotPasswordDialog = this.dialog.open<string | null>(
			ForgotPasswordComponent,
			{
				autoFocus: false,
			}
		);

		forgotPasswordDialog.closed.subscribe(email => {
			if (email) {
				this.authService
					.sendPasswordReset(email)
					.then(() => {
						this.snackbar.open(
							`An email to reset your password was send to: ${email}`,
							'',
							{
								duration: 5000,
							}
						);
					})
					.catch(() => {
						this.snackbar.open(`Unable to send email to: ${email}`, '', {
							duration: 5000,
						});
					});
			}
		});
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
