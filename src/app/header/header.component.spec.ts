import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';

import { AuthenticationService } from '../account/services/authentication.service';
import { ResponsiveService } from '../base/services/responsive.service';
import { HeaderComponent } from './header.component';
import { Devices } from '../base/models/devices';
import { MockRouter } from '../base/test-mocks/mock-router';
import SpyInstance = jest.SpyInstance;

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: MockedComponentFixture<HeaderComponent>;
	const mockRouter: MockRouter = new MockRouter();

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
			})
			.mock(Router, mockRouter);
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
		const spyLogout: SpyInstance = jest
			.spyOn(component['authService'], 'logout')
			.mockReturnValue(
				new Promise<void>(resolve => {
					resolve();
				})
			);
		const spyNavigate: SpyInstance = jest.spyOn(router, 'navigate');
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
		mockRouter.routerEvents$.next(event);
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
		mockRouter.routerEvents$.next(event);
		// Assert
		expect(component['isOnSettingsPage']()).toBe(true);
	});
});
