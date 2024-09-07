import {
	Component,
	input,
	Output,
	EventEmitter,
	ViewChild,
	InputSignal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { matchingPasswordsValidator } from './new-password-validator/matching-passwords-validator';
import { NewPassword, NewPasswordForm } from '../../models/new-password.model';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'simply-new-password',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		FormsModule,
		SpaceContentDirective,
		MatButton,
	],
	templateUrl: './new-password.component.html',
	styleUrl: './new-password.component.scss',
})
export class NewPasswordComponent {
	protected newPasswordForm: FormGroup<NewPasswordForm> = new FormGroup({
		newPassword: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
		]),
		repeatPassword: new FormControl('', [Validators.required]),
	});

	public newPasswordTitle: InputSignal<string> = input('Make a new password');
	public newPasswordSubmitText: InputSignal<string> = input('Save');

	@ViewChild('form')
	protected form: FormGroupDirective | undefined;

	@Output()
	public isSubmitted: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
		const repeat = this.newPasswordForm.get('repeatPassword');

		repeat?.addValidators(matchingPasswordsValidator(this.newPasswordForm));
	}

	protected submitPassword(): void {
		const valid = this.newPasswordForm.valid;
		const formValue: Partial<NewPassword> = this.newPasswordForm.value;

		if (valid && formValue.newPassword) {
			this.isSubmitted.emit(formValue.newPassword);
			this.form?.resetForm();
		}
	}
}
