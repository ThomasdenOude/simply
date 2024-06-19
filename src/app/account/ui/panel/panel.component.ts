import {
	Component,
	ContentChild,
	EventEmitter,
	input,
	InputSignal,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';

@Component({
	selector: 'simply-panel',
	standalone: true,
	imports: [MatIcon],
	templateUrl: './panel.component.html',
	styleUrl: './panel.component.scss',
})
export class PanelComponent {
	protected panelIsOpened: WritableSignal<boolean> = signal(false);

	public iconName: InputSignal<string | undefined> = input<string>();
	public panelTitle: InputSignal<string> = input.required<string>();

	@ContentChild(ConfirmPasswordComponent)
	private confirmPassword?: ConfirmPasswordComponent;

	@Output()
	public panelOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

	protected togglePanel(): void {
		this.panelIsOpened.update(() => !this.panelIsOpened());
		this.panelOpened.emit(this.panelIsOpened());
		if (!this.panelIsOpened() && this.confirmPassword) {
			this.confirmPassword.reset();
		}
	}
}
