import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	Output,
} from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
	selector: 'simply-confirm-reset-password',
	standalone: true,
	imports: [
		MatButton,
		MatDivider,
		MessageComponent,
		NewPasswordComponent,
		SpaceContentDirective,
	],
	templateUrl: './confirm-reset-password.component.html',
	styleUrl: './confirm-reset-password.component.scss',
})
export class ConfirmResetPasswordComponent {
	protected readonly AuthenticationMessages = AuthenticationMessages;

	public passwordCodeConfirmed: InputSignal<boolean> =
		input.required<boolean>();
	public passwordConfirmed: InputSignal<boolean> = input.required<boolean>();
	public passwordError: InputSignal<AuthenticationMessages> =
		input.required<AuthenticationMessages>();

	@Output()
	public resetPassword: EventEmitter<string> = new EventEmitter<string>();

	@Output()
	public goToApp: EventEmitter<void> = new EventEmitter<void>();

	protected emitResetPassword(newPassword: string): void {
		this.resetPassword.emit(newPassword);
	}

	protected emitGoToApp(): void {
		this.goToApp.emit();
	}
}
