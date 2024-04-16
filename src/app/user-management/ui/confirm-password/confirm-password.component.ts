import {
	Component,
	computed,
	EventEmitter,
	input,
	InputSignal,
	Output,
	Signal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';

import { MatError, MatFormField } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';

import { ErrorMessageComponent } from '../../../base/ui/error-message/error-message.component';
import { PasswordForm } from '../../models/credentials.model';
import { MatInput } from '@angular/material/input';
import { AuthenticationMessages } from '../../../base/models/authentication-messages';

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
		ErrorMessageComponent,
	],
	templateUrl: './confirm-password.component.html',
	styleUrl: './confirm-password.component.scss',
})
export class ConfirmPasswordComponent {
	protected readonly AuthenticationMessages = AuthenticationMessages;
	public passwordForm: FormGroup<PasswordForm> = new FormGroup<PasswordForm>({
		password: new FormControl('', Validators.required),
	});

	public submitErrorMessage: InputSignal<AuthenticationMessages | undefined> =
		input<AuthenticationMessages>();
	protected passwordSubmitError: Signal<AuthenticationMessages> = computed(
		() => this.submitErrorMessage() ?? AuthenticationMessages.None
	);
	@Output()
	public passwordSubmitted: EventEmitter<string> = new EventEmitter<string>();
	@Output()
	public errorClosed: EventEmitter<void> = new EventEmitter<void>();

	protected submit(): void {
		if (this.passwordForm.valid) {
			const password = this.passwordForm.value.password;
			if (password) {
				this.passwordSubmitted.emit(password);
			}
		}
	}

	protected closeError(): void {
		this.errorClosed.emit();
	}

	public reset(): void {
		this.passwordForm.reset();
	}
}
