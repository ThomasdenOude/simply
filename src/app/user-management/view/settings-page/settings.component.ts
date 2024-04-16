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

import { Devices } from '../../../base/models/devices';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../../../base/services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { RemoveAccountComponent } from '../../ui/remove-account-dialog/remove-account.component';
import { ErrorMessageComponent } from '../../../base/ui/error-message/error-message.component';
import { MenuDropdownComponent } from '../../../base/ui/menu-dropdown/menu-dropdown.component';
import { ConfirmPasswordComponent } from '../../ui/confirm-password/confirm-password.component';
import { AuthenticationMessages } from '../../../base/models/authentication-messages';

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
	],
	templateUrl: './settings.component.html',
	styleUrl: './settings.component.scss',
})
export class SettingsComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);
	private matDialog: MatDialog = inject(MatDialog);

	protected userEmail: Signal<string> = computed(
		() => this.authService.user()?.email ?? ''
	);
	protected readonly AuthenticationMessages = AuthenticationMessages;
	protected confirmedPassword: WritableSignal<boolean> = signal(false);
	protected removeAccountError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);
	protected passwordConfirmError: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected logout(): void {
		this.authService
			.logout()
			.then(() => {
				// Signed out
				this.router.navigate(['/sign-in']);
			})
			.catch();
	}

	protected confirmPassword(password: string): void {
		const email = this.authService.user()?.email;
		if (email) {
			this.authService
				.login(email, password)
				.then(() => {
					this.confirmedPassword.set(true);
					this.passwordConfirmError.set(AuthenticationMessages.None);
					this.openRemoveAccountDialog();
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

	protected clearAllErrors(): void {
		this.resetPasswordConfirmError();
		this.resetPasswordConfirmError();
		this.confirmedPassword.set(false);
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
				}
				this.removeAccountError.set(AuthenticationMessages.FailedDeleteUser);
			}
			this.resetRemoveAccountError();
			this.confirmedPassword.set(false);
		});
	}
}
