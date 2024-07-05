import { NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';

export class RouterMock {
	public readonly eventsSubject: Subject<NavigationEnd> =
		new Subject<NavigationEnd>();
	public navigate = jest.fn();
	public get events() {
		return this.eventsSubject.asObservable();
	}
}
