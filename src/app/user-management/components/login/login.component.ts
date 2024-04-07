import { Component, inject, Signal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { ResponsiveService } from '../../../core/services/responsive.service';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../core/models/devices';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		NgClass,
		MatIcon,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected loginForm: FormGroup<CredentialsForm> = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	protected login(): void {
		if (this.loginForm.valid) {
			const user: Partial<Credentials> = this.loginForm.value;
			const email = user.email;
			const password = user.password;

			if (email && password) {
				this.authService.login(email, password);
			}
		}
	}
}
