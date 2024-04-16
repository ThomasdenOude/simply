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
import { RemoveAccountComponent } from '../remove-account/remove-account.component';
import { ErrorMessageComponent } from '../../../base/components/error-message/error-message.component';
import { AuthenticationMessages } from '../../../base/models/authentication-messages';
import { MenuDropdownComponent } from '../../../base/components/menu-dropdown/menu-dropdown.component';

@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [
		NgClass,
		MatIcon,
		MatDivider,
		MatButton,
		ErrorMessageComponent,
		MenuDropdownComponent,
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
	protected settingsChangeError: WritableSignal<AuthenticationMessages> =
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

	protected removeError(): void {
		this.settingsChangeError.set(AuthenticationMessages.None);
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
							this.removeError();
							this.logout();
						})
						.catch(error => {
							this.settingsChangeError.set(
								AuthenticationMessages.FailedDeleteUser
							);
						});
				}
				this.settingsChangeError.set(AuthenticationMessages.FailedDeleteUser);
			}
		});
	}
}
