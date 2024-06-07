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
import { Router } from '@angular/router';

import { FirebaseError } from '@firebase/util';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { Email, EmailForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
	selector: 'simply-sign-up',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
		NewPasswordComponent,
		MatDivider,
		MessageComponent,
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

	private email: WritableSignal<string | null> = signal(null);
	protected continue: WritableSignal<boolean> = signal(false);
	protected signupError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

	protected emailForm: FormGroup<EmailForm> = new FormGroup<EmailForm>({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	protected submitEmail(): void {
		const valid = this.emailForm.valid;
		const email: Partial<Email> = this.emailForm.value;
		if (valid && email.email) {
			this.continue.set(true);
			this.email.set(email.email);
		}
	}

	protected signUp(newPassword: string): void {
		const email = this.email();
		if (email && newPassword) {
			this.authService
				.creatUser(email, newPassword)
				.then(() => {
					// Signed up
					void this.router.navigate(['/task-board']);
				})
				.catch((error: FirebaseError) => {
					this.signupError.set(
						this.authService.getAuthenticationMessage(error)
					);
				});
		}
	}

	protected resetError() {
		this.signupError.set(AuthenticationMessages.None);
	}
}
