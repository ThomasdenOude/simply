import { Component, inject } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { DialogRef } from '@angular/cdk/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { EmailForm } from '../../models/credentials.model';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { SubmitDataComponent } from '../../../async-data/submit-data/submit-data.component';
import { ObservePipe } from '../../../async-data/observe-pipe/observe.pipe';
import { SubmitButtonComponent } from '../../../async-data/submit-data/submit-button/submit-button.component';

@Component({
	selector: 'simply-forgot-password',
	standalone: true,
	imports: [
		FocusInputDirective,
		FormsModule,
		MatError,
		MatFormField,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
		SpaceContentDirective,
		MatDivider,
		MatIconButton,
		MatIcon,
		SubmitDataComponent,
		ObservePipe,
		SubmitButtonComponent,
	],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
	private dialogRef: DialogRef<string> = inject(DialogRef<string>);
	private authService: AuthenticationService = inject(AuthenticationService);

	protected emailForm: FormGroup<EmailForm> = new FormGroup<EmailForm>({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	protected passwordResetAction: Promise<string> | null = null;

	protected submitEmail(): void {
		const valid: boolean = this.emailForm.valid;
		const email: string | null | undefined = this.emailForm.value.email;
		if (valid && email) {
			this.passwordResetAction = this.authService
				.sendPasswordReset(email)
				.then(() => email);
		}
	}

	protected close(resetForEmail?: string): void {
		this.dialogRef.close(resetForEmail);
	}
}
