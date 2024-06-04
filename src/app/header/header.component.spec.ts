import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { Subject } from 'rxjs';
import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';

import { AuthenticationService } from '../user-management/services/authentication.service';
import { ResponsiveService } from '../base/services/responsive.service';
import { HeaderComponent } from './header.component';
import { Devices } from '../base/models/devices';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: MockedComponentFixture<HeaderComponent>;
	const routerEvents$: Subject<NavigationEnd> = new Subject<NavigationEnd>();
	class MockRouter {
		navigate(): Promise<boolean> {
			return new Promise(() => true);
		}
		get events() {
			return routerEvents$.asObservable();
		}
	}

	beforeEach(() => {
		return MockBuilder(
			[HeaderComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[ResponsiveService, AuthenticationService]
		)
			.mock(ResponsiveService, {
				device: signal(Devices.Unknown),
			})
			.mock(AuthenticationService, {
				isLoggedIn: signal(true),
				logout: jest.fn(
					() =>
						new Promise<void>(resolve => {
							resolve();
						})
				),
			})
			.mock(Router, new MockRouter());
	});

	it('should set device and login state', () => {
		// Arrange
		fixture = MockRender(HeaderComponent);
		component = fixture.point.componentInstance;
		// Assert
		expect(component['device']()).toBe(Devices.Unknown);
		expect(component['isLoggedIn']()).toBe(true);
	});

	it('should logout end redirect to sign in page', fakeAsync(() => {
		// Arrange
		fixture = MockRender(HeaderComponent);
		component = fixture.point.componentInstance;
		const router = component['router'];
		const spyNavigate = jest.spyOn(router, 'navigate');
		// Act
		component['logout']();
		tick();
		// Assert
		expect(component['authService'].logout).toHaveBeenCalledTimes(1);
		expect(spyNavigate).toHaveBeenCalledTimes(1);
		expect(spyNavigate).toHaveBeenCalledWith(['/sign-in']);
	}));

	it('should return true for isOnLogin page after router change to that route', () => {
		// Assert
		expect(component['isOnLoginPage']()).toBe(false);
		// Arrange
		fixture = MockRender(HeaderComponent);
		component = fixture.point.componentInstance;
		const event = new NavigationEnd(
			0,
			'http://localhost:4200/log-in',
			'http://localhost:4200/log-in'
		);
		// Act
		routerEvents$.next(event);
		// Assert
		expect(component['isOnLoginPage']()).toBe(true);
	});

	it('should return true for isOnSettingsPage page after router change to that route', () => {
		// Assert
		expect(component['isOnSettingsPage']()).toBe(false);
		// Arrange
		fixture = MockRender(HeaderComponent);
		component = fixture.point.componentInstance;
		const event = new NavigationEnd(
			0,
			'http://localhost:4200/settings',
			'http://localhost:4200/settings'
		);
		// Act
		routerEvents$.next(event);
		// Assert
		expect(component['isOnSettingsPage']()).toBe(true);
	});
});
