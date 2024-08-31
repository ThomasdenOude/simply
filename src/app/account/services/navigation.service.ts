import { Injectable } from '@angular/core';

import { filter, fromEvent, map, Observable, take } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	private _visibilityChange$: Observable<Event> = fromEvent(
		document,
		'visibilitychange'
	);

	public get browserTabReturned$(): Observable<null> {
		return this._visibilityChange$.pipe(
			map(() => {
				return !document.hidden;
			}),
			filter(Boolean),
			map(() => null),
			take(1)
		);
	}
}
