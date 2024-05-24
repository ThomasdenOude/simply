import {
	Component,
	OnDestroy,
	forwardRef,
	input,
	effect,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
	InputSignal,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
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
		FocusInputDirective,
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
	public newPasswordSubmitAction: InputSignal<string> = input('Save');

	@Output()
	public isSubmitted: EventEmitter<string> = new EventEmitter<string>();

	constructor() {
		const repeat = this.newPasswordForm.get('repeatPassword');

		repeat?.addValidators(matchingPasswordsValidator(this.newPasswordForm));
	}

	protected submitPassword(form: FormGroupDirective): void {
		const valid = this.newPasswordForm.valid;
		const formValue: Partial<NewPassword> = this.newPasswordForm.value;

		if (valid && formValue.newPassword) {
			this.isSubmitted.next(formValue.newPassword);
			form.resetForm();
		}
	}
}
