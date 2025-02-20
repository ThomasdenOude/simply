import { HttpErrorResponse } from '@angular/common/http';

/**
 * Represents the state of an unwrapped asynchronous primitive
 *
 *  @property loading Set to true is no value received yet
 *  @property data Set to value, when value is received, otherwise null
 *  @property empty Set to true when value is received and empty ( value is null, undefined or empty array )
 *  @property error Set to error when error is received, otherwise null
 */
export type ObserveValues<T> = {
	loading: boolean;
	data: T | null;
	empty: boolean;
	error: Error | HttpErrorResponse | null;
};
