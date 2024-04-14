import { Component, EventEmitter, input, Output } from '@angular/core';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-error-message',
	standalone: true,
	imports: [MatIconButton, MatIcon],
	templateUrl: './error-message.component.html',
	styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent {
	protected message = '';

	public errorMessage = input.required<string>();
	@Output()
	public resetError: EventEmitter<void> = new EventEmitter<void>();

	protected removeMessage(): void {
		this.resetError.emit();
	}
}
