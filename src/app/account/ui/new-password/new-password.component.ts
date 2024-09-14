import {
	Component,
	input,
	InputSignal,
	Signal,
	viewChild,
	OutputEmitterRef,
	output,
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
import { FormComponent } from '../../../base/models/form-component.class';

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
export class NewPasswordComponent extends FormComponent {
	protected newPasswordForm: FormGroup<NewPasswordForm> = new FormGroup({
		newPassword: new FormControl('', [
			Validators.required,
			Validators.minLength(8),
		]),
		repeatPassword: new FormControl('', [Validators.required]),
	});

	protected form: Signal<FormGroupDirective> =
		viewChild.required<FormGroupDirective>(FormGroupDirective);

	public newPasswordTitle: InputSignal<string> = input('Make a new password');
	public newPasswordSubmitText: InputSignal<string> = input('Save');

	public newPassword: OutputEmitterRef<string> = output<string>();

	constructor() {
		super();
		const repeat = this.newPasswordForm.get('repeatPassword');

		repeat?.addValidators(matchingPasswordsValidator(this.newPasswordForm));
	}

	protected submitPassword(): void {
		const valid = this.newPasswordForm.valid;
		const formValue: Partial<NewPassword> = this.newPasswordForm.value;

		if (valid && formValue.newPassword) {
			this.newPassword.emit(formValue.newPassword);
			this.resetForm();
		}
	}
	public resetForm(): void {
		this.form().resetForm();
	}
}
