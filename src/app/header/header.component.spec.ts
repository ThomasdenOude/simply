import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CdkMenuModule, CdkMenuTrigger } from '@angular/cdk/menu';
import { TestBed } from '@angular/core/testing';

import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
	ngMocks,
} from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../account/services/authentication.service';
import { ResponsiveService } from '../base/services/responsive.service';
import { HeaderComponent } from './header.component';
import { Devices } from '../base/models/devices';

import { dataTest, dataTestIf } from '../jest/test-helpers/data-test.helper';
import { RouterMock } from '../jest/test-mocks/router.mock';
import { AuthenticationServiceMock } from '../account/services/authentication.service.mock';
import { ResponsiveServiceMock } from '../base/services/responsive.service.mock';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: MockedComponentFixture<HeaderComponent>;
	const mockRouter: RouterMock = new RouterMock();
	const mockAuthenticationService: AuthenticationServiceMock =
		new AuthenticationServiceMock();
	const mockResponsiveService: ResponsiveServiceMock =
		new ResponsiveServiceMock();

	beforeEach(() => {
		return MockBuilder(
			[HeaderComponent, CdkMenuModule, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[ResponsiveService, AuthenticationService, Router]
		)
			.mock(ResponsiveService, mockResponsiveService)
			.mock(AuthenticationService, mockAuthenticationService)
			.mock(Router, mockRouter)
			.keep(CdkMenuTrigger);
	});

	beforeEach(() => {
		// Arrange
		fixture = MockRender(HeaderComponent);
		component = fixture.point.componentInstance;
	});

	describe('Logged in, not on mobile phone', () => {
		const mockUser: MockProxy<User> = mock<User>({
			email: 'mockEmail',
			emailVerified: true,
		});

		beforeEach(() => {
			// Act
			mockAuthenticationService.userSignal.set(mockUser);
			mockAuthenticationService.isLoggedInSignal.set(true);
			fixture.detectChanges();
		});

		it('shows full logo that links to task board', () => {
			// Arrange
			const logo = dataTest('logo');
			const link = logo.attributes['ng-reflect-router-link'];
			const logoIcon = dataTestIf('logo-icon');
			// Assert
			expect(logo).toBeTruthy();
			expect(logoIcon).toBe(false);
			expect(link).toBe('/task-board');
		});

		it('only shows menu open button', () => {
			// Arrange
			const logInButton = dataTestIf('log-in-button');
			const menuOpenButton = dataTest('menu-open-button');
			const menuCloseButton = dataTestIf('menu-close-button');
			const settingsMenu = dataTestIf('settings-menu');
			// Login
			expect(logInButton).toBe(false);
			// Menu
			expect(menuOpenButton).toBeTruthy();
			expect(menuCloseButton).toBe(false);
			expect(settingsMenu).toBe(false);
		});

		it('opens menu', () => {
			const menuOpenButton = dataTest('menu-open-button');
			// Act
			menuOpenButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const settingsMenu = dataTestIf('settings-menu');
			const userEmail = dataTest('user-email');
			const settingsButton = dataTest('settings-button');
			// Assert
			expect(settingsMenu).toBeTruthy();
			expect(userEmail.nativeElement.textContent).toBe('mockEmail');
			expect(settingsButton.attributes['ng-reflect-router-link']).toBe(
				'/account/settings'
			);
		});

		it('redirects to task-board', () => {
			const toSettingsPage = new NavigationEnd(
				0,
				'http://localhost:4200/account/settings',
				'http://localhost:4200/account/settings'
			);
			// Act
			mockRouter.eventsSubject.next(toSettingsPage);
			fixture.detectChanges();
			// Arrange
			const menuCloseButton = dataTest('menu-close-button');
			const menuOpenButton = dataTestIf('menu-open-button');
			// Assert
			expect(menuCloseButton).toBeTruthy();
			expect(menuCloseButton.attributes['ng-reflect-router-link']).toBe(
				'/task-board'
			);
			expect(menuOpenButton).toBe(false);
		});

		it('logs out and redirects to home page', () => {
			// Arrange
			const menuOpenButton = dataTest('menu-open-button');
			const authService: AuthenticationService = TestBed.inject(
				AuthenticationService
			);
			const router: Router = TestBed.inject(Router);
			// Act
			menuOpenButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const logOutButton = dataTest('log-out-button');
			// Act
			logOutButton.nativeElement.click();
			fixture.detectChanges();
			expect(authService.logout).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(['/']);
		});

		it('does not show navigation menu on authentication page', () => {
			// Arrange
			const toAuthenticationPage = new NavigationEnd(
				0,
				'http://localhost:4200/account/authenticate',
				'http://localhost:4200/account/authenticate'
			);
			// Act
			mockRouter.eventsSubject.next(toAuthenticationPage);
			fixture.detectChanges();
			// Arrange
			const navigation = dataTestIf('navigation-menu');
			// Assert
			expect(navigation).toBe(false);
		});
	});

	describe('logged in, email not verified', () => {
		const mockUser: MockProxy<User> = mock<User>({
			email: 'mockEmail',
			emailVerified: false,
		});

		beforeEach(() => {
			// Act
			mockAuthenticationService.userSignal.set(mockUser);
			mockAuthenticationService.isLoggedInSignal.set(true);
			fixture.detectChanges();
		});

		it('does not show settings button in menu', () => {
			// Arrange
			const menuOpenButton = dataTest('menu-open-button');
			// Act
			menuOpenButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const settingsButton = ngMocks.find(
				['data-test', 'settings-button'],
				false
			);
			// Assert
			expect(settingsButton).toBe(false);
		});
	});

	describe('Not logged in on device: handset portrait', () => {
		beforeEach(() => {
			// Act
			mockAuthenticationService.userSignal.set(null);
			mockAuthenticationService.isLoggedInSignal.set(false);
			mockResponsiveService.deviceSignal.set(Devices.HandsetPortrait);
			fixture.detectChanges();
		});

		it('shows logo icon that redirects to welcome page', () => {
			// Arrange
			const logo = dataTestIf('logo');
			const logoIcon = dataTest('logo-icon');
			// Assert
			expect(logo).toBe(false);
			expect(logoIcon).toBeTruthy();
			expect(logoIcon.attributes['ng-reflect-router-link']).toBe('/');
		});

		it('shows login in button', () => {
			// Arrange
			const logInButton = dataTest('log-in-button');
			const menuOpenButton = dataTestIf('menu-open-button');

			// Assert
			expect(logInButton).toBeTruthy();
			expect(logInButton.attributes['ng-reflect-router-link']).toBe(
				'/account/log-in'
			);
			expect(menuOpenButton).toBe(false);
		});

		it('does not show login button on login page', () => {
			// Arrange
			const toLoginPage = new NavigationEnd(
				0,
				'http://localhost:4200/account/log-in',
				'http://localhost:4200/account/log-in'
			);
			// Act
			mockRouter.eventsSubject.next(toLoginPage);
			fixture.detectChanges();
			// Arrange
			const logInButton = dataTestIf('log-in-button');
			// Assert
			expect(logInButton).toBe(false);
		});
	});
});
