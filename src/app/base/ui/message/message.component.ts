import {
	AfterViewInit,
	Component,
	computed,
	EventEmitter,
	input,
	InputSignal,
	OnDestroy,
	output,
	Output,
	OutputEmitterRef,
	Signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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

	public closeMessage: OutputEmitterRef<void> = output<void>();

	ngAfterViewInit() {
		if (this.form()) {
			this.form()
				?.valueChanges.pipe(takeUntil(this.destroy))
				.subscribe(() => this.emitCloseMessage());
		}
	}

	protected emitCloseMessage(): void {
		this.closeMessage.emit();
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
