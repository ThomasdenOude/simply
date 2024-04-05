import { Component, inject } from '@angular/core';
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

import { Credentials } from '../../models/credentials.interface';
import { MatIconModule } from '@angular/material/icon';

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
	],
	templateUrl: './sign-up-dialog.component.html',
	styleUrl: './sign-up-dialog.component.scss',
})
export class SignUpDialogComponent {
	private matDialogRef: MatDialogRef<SignUpDialogComponent> = inject(
		MatDialogRef<SignUpDialogComponent>
	);

	protected signInForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl(''),
		repeatPassword: new FormControl(''),
	});

	protected signIn(): void {
		const form = this.signInForm.value;
		const credentials: Credentials = {
			email: form.email,
			password: form.password,
		};

		this.matDialogRef.close(credentials);
	}

	protected cancel(): void {
		this.matDialogRef.close(null);
	}
}
