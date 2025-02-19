import { OnDestroy, Pipe, PipeTransform, untracked } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ObserveValues } from '../models/observe-values.model';

@Pipe({
	name: 'observe',
	pure: false,
	standalone: true,
})
export class ObservePipe implements PipeTransform, OnDestroy {
	private _value: Observable<any> | null = null;
	private _subscription: Subscription | null = null;
	private _observedValues: ObserveValues<any> = {
		loading: true,
		empty: false,
		data: null,
		error: null,
	};

	transform<T>(
		value: Observable<T> | null | undefined
	): ObserveValues<T> | null {
		if (!this._value) {
			if (value) {
				this._observe(value);
			}
			return this._observedValues;
		}

		if (value !== this._value) {
			this._dispose();
			return this.transform(value);
		}
		return this._observedValues;
	}

	private _observe<T>(value: Observable<T>): void {
		this._value = value;
		this._subscription = untracked(() =>
			value.subscribe({
				next: value => {
					this._observedValues = {
						loading: false,
						empty: this._isEmpty(value),
						data: value,
						error: null,
					};
				},
				error: error => {
					this._observedValues = {
						loading: false,
						empty: false,
						data: null,
						error: error,
					};
				},
			})
		);
	}

	private _isEmpty(value: any): boolean {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else {
			return value === undefined || value === null;
		}
	}

	private _dispose(): void {
		if (this._subscription) {
			this._subscription.unsubscribe();
		}
		this._value = null;
		this._observedValues = {
			loading: true,
			empty: false,
			data: null,
			error: null,
		};
		this._subscription = null;
	}

	ngOnDestroy() {
		this._dispose();
	}
}
