import { signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';

import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import SpyInstance = jest.SpyInstance;

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { LoginComponent } from './login.component';
import { RouterMock } from '../../../jest/test-mocks/router.mock';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { BaseCredentials } from '../../models/credentials.model';
import { firebaseErrorMock } from '../../../jest/test-mocks/firebase-error.mock';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: MockedComponentFixture<LoginComponent>;
	const mockRouter: RouterMock = new RouterMock();

	beforeEach(() =>
		MockBuilder(
			[LoginComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[AuthenticationService, ResponsiveService]
		)
			.mock(Router, mockRouter)
			.mock(ResponsiveService, {
				device: signal(Devices.Unknown),
			})
	);

	it('should set default device and loginError', () => {
		// Arrange
		fixture = MockRender(LoginComponent);
		component = fixture.point.componentInstance;
		// Assert
		expect(component['device']()).toBe(Devices.Unknown);
		expect(component['loginError']()).toBe(AuthenticationMessages.None);
	});

	describe('Login', () => {
		let spyLogin: SpyInstance;
		let spyNavigate: SpyInstance;
		const mockFromValue: BaseCredentials = {
			email: 'test@mail.com',
			password: 'mockPassword',
		};

		beforeEach(() => {
			// Arrange
			fixture = MockRender(LoginComponent);
			component = fixture.point.componentInstance;

			spyLogin = jest.spyOn(component['authService'], 'loginAndVerifyEmail');
			spyNavigate = jest
				.spyOn(component['router'], 'navigate')
				.mockResolvedValue(true);
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		it('should not login when form invalid', () => {
			//
			// Assert
			expect(component['loginForm'].valid).toBe(false);
			expect(spyLogin).not.toHaveBeenCalled();
		});

		it('should login and navigate to "task-board" page', fakeAsync(() => {
			// Arrange
			spyLogin.mockReturnValue(Promise.resolve());
			// Act
			component['loginForm'].patchValue(mockFromValue);
			component['login']();
			tick();
			// Assert
			expect(component['loginForm'].valid).toBe(true);
			expect(spyLogin).toHaveBeenCalledTimes(1);
			expect(spyLogin).toHaveBeenCalledWith(
				mockFromValue.email,
				mockFromValue.password
			);
			expect(spyNavigate).toHaveBeenCalledTimes(1);
			expect(spyNavigate).toHaveBeenCalledWith(['/verify-email']);
		}));

		it('should set login error on failed login, and reset login error on reset', fakeAsync(() => {
			// Arrange
			const mockErrorMessage: AuthenticationMessages =
				AuthenticationMessages.Default;
			spyLogin.mockReturnValue(Promise.reject(firebaseErrorMock));
			const spyGetAuthMessage: SpyInstance = jest
				.spyOn(component['authService'], 'getAuthenticationMessage')
				.mockReturnValue(mockErrorMessage);
			// Act
			component['loginForm'].patchValue(mockFromValue);
			component['login']();
			tick();
			// Assert
			expect(spyLogin).toHaveBeenCalledTimes(1);
			expect(spyNavigate).not.toHaveBeenCalled();
			expect(spyGetAuthMessage).toHaveBeenCalledTimes(1);
			expect(spyGetAuthMessage).toHaveBeenCalledWith(firebaseErrorMock);
			expect(component['loginError']()).toBe(mockErrorMessage);
			// Act
			component['resetError']();
			// Assert
			expect(component['loginError']()).toBe(AuthenticationMessages.None);
		}));
	});
});
