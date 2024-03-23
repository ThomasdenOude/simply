import { Component, Signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../core/services/responsive.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SigninDialogComponent } from '../components/signin-dialog/signin-dialog.component';
import { Credentials } from '../models/credentials.interface';
import { Devices } from '../../core/models/devices';

@Component({
	selector: 'app-sign-in',
	standalone: true,
	imports: [MatButtonModule, MatIconModule, SigninDialogComponent, NgClass],
	templateUrl: './sign-in.component.html',
	styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private dialog: MatDialog = inject(MatDialog);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected devices = Devices;

	protected openSignInDialog(): void {
		const signInDialogRef: MatDialogRef<SigninDialogComponent> =
			this.dialog.open(SigninDialogComponent);

		signInDialogRef
			.afterClosed()
			.subscribe((credentials: Credentials | null) => {
				if (credentials) {
					this.authService.creatUser(credentials.email, credentials.password);
				}
			});
	}
}
