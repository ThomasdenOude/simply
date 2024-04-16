import {
	AfterViewInit,
	Component,
	EventEmitter,
	input,
	OnDestroy,
	Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-error-message',
	standalone: true,
	imports: [MatIconButton, MatIcon],
	templateUrl: './error-message.component.html',
	styleUrl: './error-message.component.scss',
})
export class ErrorMessageComponent implements AfterViewInit, OnDestroy {
	private destroy: Subject<void> = new Subject<void>();
	protected message = '';

	public errorMessage = input.required<string>();
	public form = input<FormGroup>();

	@Output()
	public closed: EventEmitter<void> = new EventEmitter<void>();

	ngAfterViewInit() {
		if (this.form()) {
			this.form()
				?.valueChanges.pipe(takeUntil(this.destroy))
				.subscribe(() => this.closeMessage());
		}
	}

	protected closeMessage(): void {
		this.closed.emit();
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
