import { Component, inject, OnInit, Signal, ViewChild } from '@angular/core';
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
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { AuthenticationService } from '../../../base/services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { ErrorMessageComponent } from '../../../base/components/error-message/error-message.component';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationErrors } from '../../../base/models/authentication-errors';

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
		ErrorMessageComponent,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected readonly AuthenticationErrors = AuthenticationErrors;
	protected authenticationError: Signal<AuthenticationErrors> =
		this.authService.authenticationError;

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected loginForm: FormGroup<CredentialsForm> = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required]),
	});

	@ViewChild('emailInput', { read: MatInput, static: true })
	private emailInput?: MatInput;

	ngOnInit() {
		this.authService.resetAuthenticationError();
		this.emailInput?.focus();
	}

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

	protected resetError() {
		this.authService.resetAuthenticationError();
	}
}
