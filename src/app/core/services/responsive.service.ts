import { Injectable, Signal, computed, inject } from '@angular/core';
import {
	BreakpointObserver,
	BreakpointState,
	Breakpoints,
} from '@angular/cdk/layout';

import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { Devices } from '../models/devices';

@Injectable({
	providedIn: 'root',
})
export class ResponsiveService {
	private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
	private breakpointState$: Observable<BreakpointState> =
		this.breakpointObserver.observe([
			Breakpoints.HandsetLandscape,
			Breakpoints.Medium,
			Breakpoints.Large,
			Breakpoints.XLarge,
		]);
	private breakpointState: Signal<BreakpointState | undefined> = toSignal(
		this.breakpointState$
	);

	public device: Signal<Devices> = computed(() => {
		const breakpoints: { [key: string]: boolean } =
			this.breakpointState()?.breakpoints ?? {};
		if (breakpoints[Breakpoints.HandsetLandscape]) {
			return Devices.HandsetLandscape;
		}
		if (
			breakpoints[Breakpoints.Medium] ||
			breakpoints[Breakpoints.Large] ||
			breakpoints[Breakpoints.XLarge]
		) {
			return Devices.WideScreen;
		}
		return Devices.Unknown;
	});
}
