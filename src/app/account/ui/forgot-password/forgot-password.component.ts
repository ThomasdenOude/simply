import { Component, inject } from '@angular/core';
import { TextContentDirective } from '../../../base/directives/text-content.directive';
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

@Component({
	selector: 'simply-forgot-password',
	standalone: true,
	imports: [
		TextContentDirective,
		FocusInputDirective,
		FormsModule,
		MatError,
		MatFormField,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
		SpaceContentDirective,
		MatButton,
		MatDivider,
		MatIconButton,
		MatIcon,
	],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
	private dialogRef: DialogRef<string | null> = inject(
		DialogRef<string | null>
	);

	protected emailForm: FormGroup<EmailForm> = new FormGroup<EmailForm>({
		email: new FormControl('', [Validators.required, Validators.email]),
	});

	protected submitEmail(): void {
		const valid: boolean = this.emailForm.valid;
		const email: string | null | undefined = this.emailForm.value.email;
		if (valid && email) {
			this.dialogRef.close(email);
		}
	}

	protected close(): void {
		this.dialogRef.close(null);
	}
}
