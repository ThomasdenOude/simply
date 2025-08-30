import { Component, inject, OnDestroy, Signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Subject } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { ForgotPasswordComponent } from '../../ui/forgot-password/forgot-password.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import {
	BaseCredentials,
	BaseCredentialsForm,
} from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices.model';
import {
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
} from '../../../base/guards/auth-guards';
import { SubmitDataComponent } from '../../../async-data/submit-data/submit-data.component';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ObservePipe } from '../../../async-data/observe-pipe/observe.pipe';
import { SubmitButtonComponent } from '../../../async-data/submit-data/submit-button/submit-button.component';

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
		CenterPageComponent,
		FocusInputDirective,
		SpaceContentDirective,
		RouterLink,
		SubmitDataComponent,
		ObservePipe,
		SubmitButtonComponent,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
	private destroy: Subject<void> = new Subject<void>();

	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);
	private dialog: Dialog = inject(Dialog);
	private snackbar: MatSnackBar = inject(MatSnackBar);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected loginForm: FormGroup<BaseCredentialsForm> =
		new FormGroup<BaseCredentialsForm>({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
		});

	protected loginAction: Promise<boolean> | null = null;

	protected login(): void {
		if (this.loginForm.valid) {
			const user: Partial<BaseCredentials> = this.loginForm.value;
			const email = user.email;
			const password = user.password;

			if (email && password) {
				this.loginAction = this.authService
					.loginAndVerifyEmail(email, password)
					.then(coerceBooleanProperty);
			}
		}
	}

	protected redirectAfterLogin(emailVerified: boolean): void {
		if (emailVerified) {
			void this.router.navigate(TASK_BOARD_ROUTE);
		} else {
			void this.router.navigate(VERIFY_EMAIL_ROUTE);
		}
	}

	protected openForgotPasswordDialog(): void {
		const forgotPasswordDialog = this.dialog.open<boolean>(
			ForgotPasswordComponent,
			{
				autoFocus: false,
			}
		);

		forgotPasswordDialog.closed.subscribe(resetForEmail => {
			if (resetForEmail) {
				this.snackbar.open(
					`An email to reset your password was send to: ${resetForEmail}`,
					'',
					{
						duration: 5000,
					}
				);
			}
		});
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
