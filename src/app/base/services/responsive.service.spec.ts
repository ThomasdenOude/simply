import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Breakpoints } from '@angular/cdk/layout';

import { Subject } from 'rxjs';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ResponsiveService } from './responsive.service';
import { Devices } from '../models/devices.model';

describe('ResponsiveService', () => {
	let fixture: MockedComponentFixture<ResponsiveService>;
	let service: ResponsiveService;
	let breakpointState$: Subject<BreakpointState>;

	beforeEach(() => {
		breakpointState$ = new Subject<BreakpointState>();

		return MockBuilder(ResponsiveService, BreakpointObserver).mock(
			BreakpointObserver,
			{
				observe: () => breakpointState$,
			}
		);
	});

	describe('Devices', () => {
		beforeEach(() => {
			fixture = MockRender(ResponsiveService);
			service = fixture.point.componentInstance;
		});

		it('should return unknown if no value from BreakpointObserver', () => {
			// Assert
			expect(service.device()).toBe(Devices.Unknown);
		});

		it('should return HandsetPortrait', () => {
			// Act
			breakpointState$.next({
				matches: false,
				breakpoints: {
					[Breakpoints.HandsetPortrait]: true,
				},
			});
			// Assert
			expect(service.device()).toBe(Devices.HandsetPortrait);
		});

		it('should return HandsetLandscape', () => {
			// Act
			breakpointState$.next({
				matches: false,
				breakpoints: {
					[Breakpoints.HandsetLandscape]: true,
				},
			});
			// Assert
			expect(service.device()).toBe(Devices.HandsetLandscape);
		});

		it('should return small', () => {
			// Act
			breakpointState$.next({
				matches: false,
				breakpoints: {
					[Breakpoints.HandsetLandscape]: false,
					[Breakpoints.Small]: true,
				},
			});
			// Assert
			expect(service.device()).toBe(Devices.Small);
		});

		it('should return small', () => {
			// Act
			breakpointState$.next({
				matches: false,
				breakpoints: {
					[Breakpoints.HandsetLandscape]: true,
					[Breakpoints.Small]: true,
				},
			});
			// Assert
			expect(service.device()).toBe(Devices.HandsetLandscape);
		});

		describe('Widescreen', () => {
			it('should return widescreen for Medium breakpoint', () => {
				// Act
				breakpointState$.next({
					matches: false,
					breakpoints: {
						[Breakpoints.Medium]: true,
					},
				});
				// Assert
				expect(service.device()).toBe(Devices.WideScreen);
			});

			it('should return widescreen for Medium breakpoint', () => {
				// Act
				breakpointState$.next({
					matches: false,
					breakpoints: {
						[Breakpoints.Large]: true,
					},
				});
				// Assert
				expect(service.device()).toBe(Devices.WideScreen);
			});

			it('should return widescreen for Medium breakpoint', () => {
				// Act
				breakpointState$.next({
					matches: false,
					breakpoints: {
						[Breakpoints.XLarge]: true,
					},
				});
				// Assert
				expect(service.device()).toBe(Devices.WideScreen);
			});
		});

		it('should return unknown for Devices not listed', () => {
			// Act
			breakpointState$.next({
				matches: false,
				breakpoints: {
					[Breakpoints.XSmall]: true,
				},
			});
			// Assert
			expect(service.device()).toBe(Devices.Unknown);
		});
	});
});
