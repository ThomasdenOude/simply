import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { User } from '@angular/fire/auth';

import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { LogoComponent } from '../../../base/ui/logo/logo.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
	selector: 'simply-confirm-verify-email',
	standalone: true,
	imports: [
		LogoComponent,
		MatButton,
		MatDivider,
		MessageComponent,
		RouterLink,
		SpaceContentDirective,
	],
	templateUrl: './confirm-verify-email.component.html',
	styleUrl: './confirm-verify-email.component.scss',
})
export class ConfirmVerifyEmailComponent {
	protected readonly AuthenticationMessages = AuthenticationMessages;

	public user: InputSignal<User | null> = input.required<User | null>();
	public emailCodeConfirmed: InputSignal<boolean> = input.required<boolean>();
	public emailVerificationError: InputSignal<AuthenticationMessages> =
		input.required<AuthenticationMessages>();

	@Output()
	public goToApp: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public sendVerificationLink: EventEmitter<User> = new EventEmitter<User>();
	protected emitGoToApp(): void {
		this.goToApp.emit();
	}

	protected emitSendVerificationLink(user: User): void {
		this.sendVerificationLink.emit(user);
	}
}
