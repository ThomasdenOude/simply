import { Component, Signal, inject } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../core/services/responsive.service';
import { AuthenticationService } from '../../core/services/authentication.service';
import { SignUpDialogComponent } from '../components/sign-up-dialog/sign-up-dialog.component';
import { Credentials } from '../models/credentials.interface';
import { Devices } from '../../core/models/devices';

@Component({
	selector: 'app-user-management',
	standalone: true,
	imports: [MatButtonModule, MatIconModule, SignUpDialogComponent, NgClass],
	templateUrl: './sign-up.component.html',
	styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private dialog: MatDialog = inject(MatDialog);

	protected device: Signal<Devices> = this.responsiveService.device;

	protected openSignInDialog(): void {
		const signInDialogRef: MatDialogRef<SignUpDialogComponent> =
			this.dialog.open(SignUpDialogComponent);

		signInDialogRef
			.afterClosed()
			.subscribe((credentials: Credentials | null) => {
				if (credentials) {
					this.authService.creatUser(credentials.email, credentials.password);
				}
			});
	}

	protected readonly Devices = Devices;
}
