import {
	Component,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { User } from '@angular/fire/auth';

import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { LogoComponent } from '../../../base/ui/logo/logo.component';
import { SubmitErrorComponent } from '../../../async-data/submit-data/submit-error/submit-error.component';
import { AuthenticationMessages } from '../../models/authentication-messages';

@Component({
    selector: 'simply-confirm-verify-email',
    imports: [
        LogoComponent,
        MatButtonModule,
        MatDivider,
        SubmitErrorComponent,
        RouterLink,
        SpaceContentDirective,
    ],
    templateUrl: './confirm-verify-email.component.html',
    styleUrl: './confirm-verify-email.component.scss'
})
export class ConfirmVerifyEmailComponent {
	protected readonly AuthenticationMessages = AuthenticationMessages;

	public user: InputSignal<User | null> = input.required<User | null>();
	public emailCodeConfirmed: InputSignal<boolean> = input.required<boolean>();
	public emailVerificationError: InputSignal<AuthenticationMessages> =
		input.required<AuthenticationMessages>();

	public goToApp: OutputEmitterRef<void> = output<void>();
	public sendVerificationLink: OutputEmitterRef<User> = output<User>();
	protected emitGoToApp(): void {
		this.goToApp.emit();
	}

	protected emitSendVerificationLink(user: User): void {
		this.sendVerificationLink.emit(user);
	}
}
