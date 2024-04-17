import {
	Component,
	inject,
	OnInit,
	signal,
	Signal,
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
import { Router } from '@angular/router';

import { FirebaseError } from '@firebase/util';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { ErrorMessageComponent } from '../../../base/ui/error-message/error-message.component';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';

@Component({
	selector: 'app-login-page',
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
		CenterPageComponent,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

	protected readonly AuthenticationErrors = AuthenticationMessages;
	protected loginError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected loginForm: FormGroup<CredentialsForm> =
		new FormGroup<CredentialsForm>({
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
		});

	@ViewChild('emailInput', { read: MatInput, static: true })
	private emailInput?: MatInput;

	ngOnInit() {
		this.emailInput?.focus();
	}

	protected login(): void {
		if (this.loginForm.valid) {
			const user: Partial<Credentials> = this.loginForm.value;
			const email = user.email;
			const password = user.password;

			if (email && password) {
				this.authService
					.login(email, password)
					.then(() => {
						// Signed in
						this.router.navigate(['/task-manager']);
					})
					.catch((error: FirebaseError) => {
						this.loginError.set(
							this.authService.getAuthenticationMessage(error)
						);
					});
			}
		}
	}

	protected resetError() {
		this.loginError.set(AuthenticationMessages.None);
	}
}
