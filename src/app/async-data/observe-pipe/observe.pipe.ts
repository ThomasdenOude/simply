import { HttpErrorResponse } from '@angular/common/http';
import {
	ChangeDetectorRef,
	EventEmitter,
	inject,
	OnDestroy,
	Pipe,
	PipeTransform,
	untracked,
	ɵisPromise,
	ɵisSubscribable,
} from '@angular/core';

import { Observable, Subscribable, Unsubscribable } from 'rxjs';

import { ObserveValues } from '../models/observe-values.model';

/**
 * From {@link https://github.com/angular/angular/blob/main/packages/common/src/pipes/async_pipe.ts}
 */
interface SubscriptionStrategy {
	createSubscription(
		async: Subscribable<any> | Promise<any>,
		updateSuccessValue: (v: any) => void,
		updateErrorValue: (v: any) => void
	): Unsubscribable | Promise<any>;
	dispose(subscription: Unsubscribable | Promise<any>): void;
}

class SubscribableStrategy implements SubscriptionStrategy {
	createSubscription(
		async: Subscribable<any>,
		updateSuccessValue: (v: any) => void,
		updateErrorValue: (v: any) => void
	): Unsubscribable {
		return untracked(() =>
			async.subscribe({
				next: updateSuccessValue,
				error: updateErrorValue,
			})
		);
	}

	dispose(subscription: Unsubscribable): void {
		untracked(() => subscription.unsubscribe());
	}
}

class PromiseStrategy implements SubscriptionStrategy {
	createSubscription(
		async: Promise<any>,
		updateSuccessValue: (v: any) => void,
		updateErrorValue: (v: any) => void
	): Promise<any> {
		return async.then(updateSuccessValue, updateErrorValue);
	}

	dispose(subscription: Promise<any>): void {}
}

const _promiseStrategy = new PromiseStrategy();
const _subscribableStrategy = new SubscribableStrategy();

/**
 * Unwraps a value from an asynchronous primitive
 * - Observables
 *  - Promises
 *  - EventEmitters
 *
 * Based on the [AsyncPipe](https://github.com/angular/angular/blob/main/packages/common/src/pipes/async_pipe.ts) from angular
 *
 * Returns the observed values: {@link ObserveValues}, representing the state of the asynchronous primitive
 */
@Pipe({
	name: 'observe',
	pure: false,
	standalone: true,
})
export class ObservePipe implements PipeTransform, OnDestroy {
	private _ref: ChangeDetectorRef | null = inject(ChangeDetectorRef);
	private _markForCheckOnValueUpdate = true;

	private _observedValues: ObserveValues<any> | null = null;
	private _subscription: Unsubscribable | Promise<any> | null = null;
	private _asyncObj:
		| Subscribable<any>
		| Promise<any>
		| EventEmitter<any>
		| null = null;
	private _strategy: SubscriptionStrategy | null = null;

	transform<T>(
		asyncObj: Observable<T> | Subscribable<T> | Promise<T>
	): ObserveValues<T> | null;
	transform<T>(value: null | undefined): null;
	transform<T>(
		asyncObj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined
	): ObserveValues<T> | null;
	transform<T>(
		asyncObj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined
	): ObserveValues<T> | null {
		if (!this._asyncObj) {
			if (asyncObj) {
				try {
					this._markForCheckOnValueUpdate = false;
					this._observedValues = {
						loading: true,
						empty: false,
						data: null,
						error: null,
					};
					this._observe(asyncObj);
				} finally {
					this._markForCheckOnValueUpdate = true;
				}
			}
			return this._observedValues;
		}

		if (asyncObj !== this._asyncObj) {
			this._dispose();
			return this.transform(asyncObj);
		}
		return this._observedValues;
	}

	private _observe<T>(
		asyncObj: Subscribable<T> | Promise<T> | EventEmitter<T>
	): void {
		this._asyncObj = asyncObj;
		this._strategy = this._selectStrategy(asyncObj);
		this._subscription = this._strategy.createSubscription(
			asyncObj,
			(value: T) => this._setData(asyncObj, value),
			(error: Error | HttpErrorResponse) => this._setError(asyncObj, error)
		);
	}

	private _selectStrategy(
		asyncObj: Subscribable<any> | Promise<any> | EventEmitter<any>
	): SubscriptionStrategy {
		if (ɵisPromise(asyncObj)) {
			return _promiseStrategy;
		}

		if (ɵisSubscribable(asyncObj)) {
			return _subscribableStrategy;
		}

		throw new Error('Invalid argument for observe pipe');
	}

	private _setData<T>(
		asyncObj: Subscribable<any> | Promise<any> | EventEmitter<any>,
		value: T
	): void {
		if (asyncObj === this._asyncObj) {
			this._observedValues = {
				loading: false,
				empty: this._isEmpty(value),
				data: value,
				error: null,
			};
			this._markForCheck();
		}
	}

	private _setError<T>(
		asyncObj: Subscribable<any> | Promise<any> | EventEmitter<any>,
		error: Error | HttpErrorResponse
	): void {
		if (asyncObj === this._asyncObj) {
			this._observedValues = {
				loading: false,
				empty: false,
				data: null,
				error: error,
			};
		}
		this._markForCheck();
	}

	private _isEmpty(value: any): boolean {
		if (Array.isArray(value)) {
			return value.length === 0;
		} else {
			return value === undefined || value === null;
		}
	}

	private _markForCheck(): void {
		if (this._markForCheckOnValueUpdate) {
			this._ref?.markForCheck();
		}
	}

	private _dispose(): void {
		if (this._strategy && this._subscription) {
			this._strategy.dispose(this._subscription);
		}
		this._asyncObj = null;
		this._observedValues = null;
		this._subscription = null;
	}

	ngOnDestroy() {
		this._dispose();
		this._ref = null;
	}
}
