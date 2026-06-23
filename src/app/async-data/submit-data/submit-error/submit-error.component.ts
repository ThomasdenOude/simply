import {
	Component,
	computed,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	Signal,
} from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FirebaseError } from '@firebase/util';
import { AuthenticationMessages } from '../../../account/models/authentication-messages';
import { authenticationErrorMap } from '../../../account/data/authentication-messages.map';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'simply-submit-error',
    imports: [MatIconButton, MatIcon],
    templateUrl: './submit-error.component.html',
    styleUrl: './submit-error.component.scss'
})
export class SubmitErrorComponent {
	public submitError: InputSignal<
		Error | HttpErrorResponse | FirebaseError | null
	> = input<Error | HttpErrorResponse | FirebaseError | null>(null);
	public submitMessage: InputSignal<AuthenticationMessages | string | null> =
		input<AuthenticationMessages | string | null>(null);
	protected errorMessage: Signal<AuthenticationMessages | string> = computed(
		() => {
			const submitMessage = this.submitMessage();
			const submitError = this.submitError();

			if (submitMessage) return submitMessage;
			if (submitError) return this._getErrorMessage(submitError);
			return '';
		}
	);

	public closeMessage: OutputEmitterRef<void> = output<void>();

	protected emitCloseMessage(): void {
		this.closeMessage.emit();
	}

	protected _getErrorMessage(
		error: Error | HttpErrorResponse | FirebaseError
	): AuthenticationMessages | string {
		return this._isFirebaseError(error)
			? authenticationErrorMap.get(error.code) ?? AuthenticationMessages.Default
			: error.message;
	}

	private _isFirebaseError(
		error: Error | HttpErrorResponse | FirebaseError
	): error is FirebaseError {
		return (error as FirebaseError).code !== undefined;
	}
}
