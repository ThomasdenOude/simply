import {
	Component,
	computed,
	inject,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { Devices } from '../../../base/models/devices';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { RemoveAccountComponent } from '../../ui/remove-account-dialog/remove-account.component';
import { ErrorMessageComponent } from '../../../base/ui/error-message/error-message.component';
import { MenuDropdownComponent } from '../../../base/ui/menu-dropdown/menu-dropdown.component';
import { ConfirmPasswordComponent } from '../../ui/confirm-password/confirm-password.component';
import { NewPasswordFormFieldComponent } from '../../ui/new-password-form-field/new-password-form-field.component';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { SettingsAction } from '../../models/settings-actions.model';
import { PasswordForm } from '../../models/credentials.model';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';

@Component({
	selector: 'app-settings-page',
	standalone: true,
	imports: [
		NgClass,
		MatIcon,
		MatDivider,
		MatButton,
		ErrorMessageComponent,
		MenuDropdownComponent,
		ConfirmPasswordComponent,
		ReactiveFormsModule,
		FormsModule,
		NewPasswordFormFieldComponent,
		CenterPageComponent,
	],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private router: Router = inject(Router);
	private matDialog: MatDialog = inject(MatDialog);

	protected userEmail: Signal<string> = computed(
		() => this.authService.user()?.email ?? ''
	);
	protected readonly AuthenticationMessages = AuthenticationMessages;
	protected passwordConfirmed: WritableSignal<boolean> = signal(false);
	protected changePasswordMessage: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);
	protected continuePasswordChange: WritableSignal<boolean> = signal(false);
	protected invalidChangePassword: WritableSignal<boolean> = signal(false);
	protected removeAccountError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);
	protected passwordConfirmError: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);

	protected changePasswordForm: FormGroup<PasswordForm> =
		new FormGroup<PasswordForm>({
			password: new FormControl('', Validators.required),
		});

	protected logout(): void {
		this.authService
			.logout()
			.then(() => {
				// Signed out
				this.router.navigate(['/sign-in']);
			})
			.catch();
	}

	protected confirmPassword(password: string, action: SettingsAction): void {
		const email = this.authService.user()?.email;
		if (email) {
			this.authService
				.login(email, password)
				.then(() => {
					this.passwordConfirmed.set(true);
					this.passwordConfirmError.set(AuthenticationMessages.None);
					if (action === 'RemoveAccount') {
						this.openRemoveAccountDialog();
					}
					if (action === 'ChangePassword') {
						this.continuePasswordChange.set(true);
					}
				})
				.catch(error => {
					this.passwordConfirmError.set(
						this.authService.getAuthenticationMessage(error)
					);
				});
		}
	}

	protected resetRemoveAccountError(): void {
		this.removeAccountError.set(AuthenticationMessages.None);
	}

	protected resetPasswordConfirmError(): void {
		this.passwordConfirmError.set(AuthenticationMessages.None);
	}

	protected resetChangePasswordMessage(): void {
		this.changePasswordMessage.set(AuthenticationMessages.None);
	}

	protected resetAll(): void {
		this.resetPasswordConfirmError();
		this.resetPasswordConfirmError();
		this.resetChangePasswordMessage();
		this.continuePasswordChange.set(false);
		this.passwordConfirmed.set(false);
	}

	protected openRemoveAccountDialog(): void {
		const removeDialog = this.matDialog.open<
			RemoveAccountComponent,
			null,
			boolean
		>(RemoveAccountComponent);

		removeDialog.afterClosed().subscribe((remove: boolean | undefined) => {
			if (remove) {
				const user: User | null = this.authService.user();
				if (user) {
					this.authService
						.deleteUser(user)
						.then(() => {
							this.resetRemoveAccountError();
							this.logout();
						})
						.catch(error => {
							this.removeAccountError.set(
								AuthenticationMessages.FailedDeleteUser
							);
						});
				} else {
					this.removeAccountError.set(AuthenticationMessages.FailedDeleteUser);
				}
			} else {
				this.resetRemoveAccountError();
			}
		});
		this.passwordConfirmed.set(false);
	}

	protected submitChangePassword(): void {
		if (this.changePasswordForm.valid) {
			const user: User | null = this.authService.user();
			const newPassword = this.changePasswordForm.value.password;
			if (user && newPassword) {
				this.authService
					.changePassword(user, newPassword)
					.then(() => {
						this.changePasswordMessage.set(
							AuthenticationMessages.SuccessfulPasswordChange
						);
					})
					.catch(error => {
						this.changePasswordMessage.set(
							this.authService.getAuthenticationMessage(error)
						);
					});
			} else {
				this.changePasswordMessage.set(AuthenticationMessages.Default);
			}
			this.passwordConfirmed.set(false);
		} else if (this.continuePasswordChange()) {
			this.invalidChangePassword.set(true);
		}
	}
}
