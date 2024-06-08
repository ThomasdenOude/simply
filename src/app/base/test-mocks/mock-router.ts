import { NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';

export class MockRouter {
	public readonly routerEvents$: Subject<NavigationEnd> =
		new Subject<NavigationEnd>();
	public navigate = jest.fn();
	public get events() {
		return this.routerEvents$.asObservable();
	}
}
