import { Component, Signal, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../core/services/responsive.service';
import { AuthenticationService } from '../core/services/authentication.service';
import { LoginDialogComponent } from '../user-management/components/login-dialog/login-dialog.component';
import { Credentials } from '../user-management/models/credentials.model';
import { Devices } from '../core/models/devices';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [NgClass, MatButtonModule, MatIconModule, AsyncPipe],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private matDialog: MatDialog = inject(MatDialog);
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected openLoginDialog(): void {
		const loginDialogRef: MatDialogRef<LoginDialogComponent> =
			this.matDialog.open(LoginDialogComponent);

		loginDialogRef.afterClosed().subscribe((user: Credentials | null) => {
			if (user) {
				this.authService.login(user.email, user.password);
			}
		});
	}

	protected logout(): void {
		this.authService.logout();
	}
}
