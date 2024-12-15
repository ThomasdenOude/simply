import {
	Component,
	contentChildren,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	signal,
	WritableSignal,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';

import { FormComponent } from '../../../base/models/form-component.class';

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

	private formComponents = contentChildren(FormComponent);

	public panelOpened: OutputEmitterRef<boolean> = output<boolean>();

	protected togglePanel(): void {
		this.panelIsOpened.update(() => !this.panelIsOpened());
		console.log('Opened', this.panelIsOpened());
		this.panelOpened.emit(this.panelIsOpened());
		if (!this.panelIsOpened() && this.formComponents().length) {
			this.formComponents().forEach((formComponent: FormComponent) => {
				formComponent.resetForm();
			});
		}
	}
}
