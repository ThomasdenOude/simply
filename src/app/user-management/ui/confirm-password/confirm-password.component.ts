import {
	Component,
	computed,
	EventEmitter,
	input,
	InputSignal,
	Output,
	Signal,
	ViewChild,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormGroupDirective,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatError, MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';

import { MessageComponent } from '../../../base/ui/message/message.component';
import { Password, PasswordForm } from '../../models/credentials.model';
import { MatInput } from '@angular/material/input';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';

@Component({
	selector: 'simply-confirm-password',
	standalone: true,
	imports: [
		MatFormField,
		MatButton,
		FormsModule,
		ReactiveFormsModule,
		MatInput,
		MatError,
		MessageComponent,
		SpaceContentDirective,
	],
	templateUrl: './confirm-password.component.html',
	styleUrl: './confirm-password.component.scss',
})
export class ConfirmPasswordComponent {
	protected readonly AuthenticationMessages = AuthenticationMessages;
	public passwordForm: FormGroup<PasswordForm> = new FormGroup<PasswordForm>({
		password: new FormControl('', Validators.required),
	});

	public setPasswordConfirmError: InputSignal<
		AuthenticationMessages | undefined
	> = input<AuthenticationMessages>();
	protected passwordConfirmError: Signal<AuthenticationMessages> = computed(
		() => this.setPasswordConfirmError() ?? AuthenticationMessages.None
	);
	@Output()
	public onPasswordSubmit: EventEmitter<string> = new EventEmitter<string>();
	@Output()
	public onErrorClose: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild('form')
	private form: FormGroupDirective | undefined;

	protected submit(): void {
		const valid: boolean = this.passwordForm.valid;
		const form: Partial<Password> = this.passwordForm.value;

		if (valid && form.password) {
			this.onPasswordSubmit.emit(form.password);
			this.reset();
		}
	}

	protected closeError(): void {
		this.onErrorClose.emit();
	}

	public reset(): void {
		this.form?.resetForm();
	}
}
