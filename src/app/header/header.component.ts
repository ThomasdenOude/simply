import { Component, Signal, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../core/services/authentication.service';
import { LoginDialogComponent } from '../sign-in/components/login-dialog/login-dialog.component';
import { Credentials } from '../sign-in/models/credentials.interface';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [MatButtonModule, MatIconModule, AsyncPipe],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private matDialog: MatDialog = inject(MatDialog);

	protected isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;

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
