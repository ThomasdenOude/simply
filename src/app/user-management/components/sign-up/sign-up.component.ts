import {
	Component,
	inject,
	OnInit,
	Signal,
	signal,
	ViewChild,
	WritableSignal,
} from '@angular/core';
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
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../../base/services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { NewPasswordFormFieldComponent } from '../new-password-form-field/new-password-form-field.component';
import { ErrorMessageComponent } from '../../../base/components/error-message/error-message.component';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationErrors } from '../../../base/models/authentication-errors';

@Component({
	selector: 'app-sign-up',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
		NewPasswordFormFieldComponent,
		NgClass,
		MatDivider,
		ErrorMessageComponent,
	],
	templateUrl: './sign-up.component.html',
	styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected readonly AuthenticationErrors = AuthenticationErrors;
	protected authenticationError: Signal<AuthenticationErrors> =
		this.authService.authenticationError;
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected continue: WritableSignal<boolean> = signal(false);
	protected invalidSubmit: WritableSignal<boolean> = signal(false);

	protected signUpForm: FormGroup<CredentialsForm> = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl(''),
	});

	@ViewChild('emailInput', { read: MatInput, static: true })
	private emailInput?: MatInput;
	ngOnInit() {
		this.authService.resetAuthenticationError();
		this.emailInput?.focus();
	}

	protected setContinue(): void {
		const email = this.signUpForm.get('email');
		if (email?.valid) {
			this.continue.set(true);
		}
	}

	protected signUp(): void {
		if (this.signUpForm.valid) {
			const form: Partial<Credentials> = this.signUpForm.value;
			const email = form.email;
			const password = form.password;
			if (email && password) {
				this.authService.creatUser(email, password);
			}
		}
		if (this.continue()) {
			this.invalidSubmit.update(() => true);
		}
		this.setContinue();
	}

	protected resetError() {
		this.authService.resetAuthenticationError();
	}
}
