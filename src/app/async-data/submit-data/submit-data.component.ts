import {
	AfterViewInit,
	Component,
	computed,
	contentChild,
	effect,
	model,
	ModelSignal,
	OnChanges,
	output,
	OutputEmitterRef,
	Signal,
} from '@angular/core';

import { ObserveValues } from '../models/observe-values.model';
import { SubmitErrorComponent } from './submit-error/submit-error.component';
import { SubmitButtonComponent } from './submit-button/submit-button.component';

@Component({
	selector: 'simply-submit-data',
	standalone: true,
	imports: [SubmitErrorComponent],
	templateUrl: './submit-data.component.html',
	styleUrl: './submit-data.component.scss',
})
export class SubmitDataComponent<T> implements OnChanges {
	public submitData: ModelSignal<ObserveValues<T> | null> =
		model<ObserveValues<T> | null>(null);

	public submitResult: OutputEmitterRef<T> = output();

	public submitButton: Signal<SubmitButtonComponent | undefined> = contentChild(
		SubmitButtonComponent
	);

	ngOnChanges(): void {
		const submitData = this.submitData();
		if (submitData?.data) {
			this.submitResult.emit(submitData.data);
		}
		this.submitButton()?.isLoading.set(submitData?.loading ?? false);
	}

	protected resetSubmitData(): void {
		this.submitData.set(null);
	}
}
