import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Credentials } from '../../models/credentials.model';
import { MatIconModule } from '@angular/material/icon';
import { NewPasswordFormFieldComponent } from '../new-password-form-field/new-password-form-field.component';
import { SignUp, SignUpForm } from '../../models/sign-up-form.model';

@Component({
	selector: 'app-sign-up-dialog',
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
	],
	templateUrl: './sign-up-dialog.component.html',
	styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {
	private matDialogRef: MatDialogRef<SignUpDialogComponent> = inject(
		MatDialogRef<SignUpDialogComponent>
	);
	protected invalidSubmit: WritableSignal<boolean> = signal(false);

	protected signUpForm: FormGroup<SignUpForm> = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl(''),
	});

	protected signUp(): void {
		if (this.signUpForm.valid) {
			const form: Partial<SignUp> = this.signUpForm.value;
			const email = form.email;
			const password = form.password;
			if (email && password) {
				const credentials: Credentials = {
					email: email,
					password: password,
				};
				this.matDialogRef.close(credentials);
			}
		}
		this.invalidSubmit.update(() => true);
	}

	protected cancel(): void {
		this.matDialogRef.close(null);
	}
}
