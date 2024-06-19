import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../../services/authentication.service';
import { RemoveAccountComponent } from '../../ui/remove-account/remove-account.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { PanelComponent } from '../../ui/panel/panel.component';
import { ConfirmPasswordComponent } from '../../ui/confirm-password/confirm-password.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { SettingsActions } from '../../models/settings-actions.model';
import { TextContentDirective } from '../../../base/directives/text-content.directive';
import { LogoComponent } from '../../../base/ui/logo/logo.component';

@Component({
	selector: 'simply-settings',
	standalone: true,
	imports: [
		NgClass,
		MatIcon,
		MatDivider,
		MatButton,
		DialogModule,
		MessageComponent,
		PanelComponent,
		ConfirmPasswordComponent,
		ReactiveFormsModule,
		FormsModule,
		NewPasswordComponent,
		CenterPageComponent,
		SpaceContentDirective,
		TextContentDirective,
		LogoComponent,
	],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private router: Router = inject(Router);
	private dialog: Dialog = inject(Dialog);

	protected readonly AuthenticationMessages = AuthenticationMessages;
	protected changePasswordMessage: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);
	protected continuePasswordChange: WritableSignal<boolean> = signal(false);
	protected removeAccountError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);
	protected passwordConfirmError: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);

	protected logout(): void {
		this.authService
			.logout()
			.then(() => {
				// Signed out
				void this.router.navigate(['/sign-in']);
			})
			.catch(() => {});
	}

	protected confirmPassword(password: string, action: SettingsActions): void {
		const email = this.authService.user()?.email;
		if (email) {
			this.authService
				.loginAndVerifyEmail(email, password)
				.then(() => {
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
		this.resetChangePasswordMessage();
		this.resetRemoveAccountError();
		this.continuePasswordChange.set(false);
	}

	protected openRemoveAccountDialog(): void {
		const removeDialog = this.dialog.open<boolean>(RemoveAccountComponent);

		removeDialog.closed.subscribe((remove: boolean | undefined) => {
			if (remove) {
				const user: User | null = this.authService.user();
				if (user) {
					this.authService
						.deleteUser(user)
						.then(() => {
							this.resetRemoveAccountError();
							this.logout();
						})
						.catch(() => {
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
	}

	protected submitChangePassword(changedPassword: string): void {
		const user: User | null = this.authService.user();

		if (user && changedPassword) {
			this.authService
				.changePassword(user, changedPassword)
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
	}
}
