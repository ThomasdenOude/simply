import { Component, EventEmitter, Output } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatError, MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';

import { PasswordForm } from '../../models/credentials.model';
import { MatInput } from '@angular/material/input';

@Component({
	selector: 'app-confirm-password',
	standalone: true,
	imports: [
		MatFormField,
		MatButton,
		FormsModule,
		ReactiveFormsModule,
		MatInput,
		MatError,
	],
	templateUrl: './confirm-password.component.html',
	styleUrl: './confirm-password.component.scss',
})
export class ConfirmPasswordComponent {
	protected passwordForm: FormGroup<PasswordForm> = new FormGroup<PasswordForm>(
		{
			password: new FormControl('', Validators.required),
		}
	);

	@Output()
	public passwordSubmitted: EventEmitter<string> = new EventEmitter<string>();

	protected submit(): void {
		if (this.passwordForm.valid) {
			const password = this.passwordForm.value.password;
			if (password) {
				this.passwordSubmitted.emit(password);
			}
		}
	}
}
