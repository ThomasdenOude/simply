import { Injectable, Signal } from '@angular/core';

import { fromEvent, map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
	providedIn: 'root',
})
export class VisibilityChangesService {
	private _browserTabReturned$: Observable<boolean> = fromEvent(
		document,
		'visibilitychange'
	).pipe(
		map(() => {
			return !document.hidden;
		})
	);

	public browserTabReturned: Signal<boolean | undefined> = toSignal(
		this._browserTabReturned$
	);
}
