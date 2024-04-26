import {
	Component,
	inject,
	Signal,
	signal,
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
import { Router } from '@angular/router';

import { FirebaseError } from '@firebase/util';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { NewPasswordComponent } from '../../ui/new-password-form-field/new-password.component';
import { ErrorMessageComponent } from '../../../base/ui/error-message/error-message.component';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
	selector: 'simply-sign-up',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatDialogModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
		NewPasswordComponent,
		NgClass,
		MatDivider,
		ErrorMessageComponent,
		CenterPageComponent,
		FocusInputDirective,
		SpaceContentDirective,
	],
	templateUrl: './sign-up.component.html',
	styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

	protected readonly AuthenticationMessages = AuthenticationMessages;
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected continue: WritableSignal<boolean> = signal(false);
	protected invalidSubmit: WritableSignal<boolean> = signal(false);
	protected signupError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

	protected signUpForm: FormGroup<CredentialsForm> =
		new FormGroup<CredentialsForm>({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl(''),
		});

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
				this.authService
					.creatUser(email, password)
					.then(() => {
						// Signed up
						this.router.navigate(['/task-manager']);
					})
					.catch((error: FirebaseError) => {
						this.signupError.set(
							this.authService.getAuthenticationMessage(error)
						);
					});
			}
		}
		if (this.continue()) {
			this.invalidSubmit.set(true);
		}
		this.setContinue();
	}

	protected resetError() {
		this.signupError.set(AuthenticationMessages.None);
	}
}
