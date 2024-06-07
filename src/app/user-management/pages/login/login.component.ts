import {
	Component,
	inject,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { FirebaseError } from '@firebase/util';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { Credentials, CredentialsForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
	selector: 'simply-login',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		ReactiveFormsModule,
		MatIcon,
		MessageComponent,
		CenterPageComponent,
		FocusInputDirective,
		SpaceContentDirective,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
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
						void this.router.navigate(['/task-board']);
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
