import {
	AfterViewInit,
	Component,
	EventEmitter,
	input,
	InputSignal,
	OnDestroy,
	Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'simply-message',
	standalone: true,
	imports: [MatIconButton, MatIcon],
	templateUrl: './message.component.html',
	styleUrl: './message.component.scss',
})
export class MessageComponent implements AfterViewInit, OnDestroy {
	private destroy: Subject<void> = new Subject<void>();
	protected message = '';

	public errorMessage: InputSignal<string> = input.required<string>();
	public form: InputSignal<FormGroup | undefined> = input<FormGroup>();

	@Output()
	public onClose: EventEmitter<void> = new EventEmitter<void>();

	ngAfterViewInit() {
		if (this.form()) {
			this.form()
				?.valueChanges.pipe(takeUntil(this.destroy))
				.subscribe(() => this.closeMessage());
		}
	}

	protected closeMessage(): void {
		this.onClose.emit();
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
