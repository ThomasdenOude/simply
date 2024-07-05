import { Router, RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import SpyInstance = jest.SpyInstance;
import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';

import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { SignUpComponent } from './sign-up.component';
import { RouterMock } from '../../../jest/test-mocks/router.mock';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { Email } from '../../models/credentials.model';
import { firebaseErrorMock } from '../../../jest/test-mocks/firebase-error.mock';

describe('SignUpComponent', () => {
	const mockRouter: RouterMock = new RouterMock();
	let component: SignUpComponent;
	let fixture: MockedComponentFixture<SignUpComponent>;

	beforeEach(() =>
		MockBuilder(
			[SignUpComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[AuthenticationService, ResponsiveService]
		)
			.mock(Router, mockRouter)
			.mock(ResponsiveService, {
				device: signal(Devices.Unknown),
			})
	);

	beforeEach(() => {
		fixture = MockRender(SignUpComponent);
		component = fixture.point.componentInstance;
	});

	it('should set default values', () => {
		// Assert
		expect(component['device']()).toBe(Devices.Unknown);
		expect(component['emailChange']()).toBeFalsy();
		expect(component['continue']()).toBe(false);
		expect(component['signupError']()).toBe(AuthenticationMessages.None);
	});

	describe('Email form', () => {
		// Arrange
		const mockEmailFormValue: Email = {
			email: 'mock@email.com',
		};

		it('should not continue on invalid form', () => {
			// Act
			component['submitEmail']();
			// Assert
			expect(component['emailForm'].valid).toBe(false);
			expect(component['continue']()).toBe(false);
			expect(component['emailChange']()).toBeFalsy();
		});

		it('should continue with email on valid form', () => {
			// Act
			component['emailForm'].patchValue(mockEmailFormValue);
			component['submitEmail']();
			// Assert
			expect(component['emailForm'].valid).toBe(true);
			expect(component['continue']()).toBe(true);
			expect(component['emailChange']()).toBe(mockEmailFormValue.email);
		});
	});

	describe('Sign up', () => {
		// Arrange
		const mockEmail = 'mock@email.com';
		const mockPassword = 'mockPassword';
		let spyCreateUser: SpyInstance;
		let spyNavigate: SpyInstance;

		beforeEach(() => {
			// Arrange
			spyCreateUser = jest.spyOn(
				component['authService'],
				'creatUserAndVerifyEmail'
			);
			spyNavigate = jest
				.spyOn(component['router'], 'navigate')
				.mockResolvedValue(true);
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		it('should sign up with email and password', fakeAsync(() => {
			// Arrange
			spyCreateUser.mockReturnValue(Promise.resolve());
			// Act
			component['emailForm'].get('email')?.setValue(mockEmail);
			component['signUp'](mockPassword);
			tick();
			// Assert
			expect(spyCreateUser).toHaveBeenCalledTimes(1);
			expect(spyCreateUser).toHaveBeenCalledWith(mockEmail, mockPassword);
			expect(spyNavigate).toHaveBeenCalledTimes(1);
			expect(spyNavigate).toHaveBeenCalledWith(['/verify-email']);
		}));

		it('should set error message for failed create user and reset errorMessage on reset', fakeAsync(() => {
			// Arrange
			const mockErrorMessage: AuthenticationMessages =
				AuthenticationMessages.Default;
			spyCreateUser.mockReturnValue(Promise.reject(firebaseErrorMock));
			const spyGetAuthMessage: SpyInstance = jest
				.spyOn(component['authService'], 'getAuthenticationMessage')
				.mockReturnValue(mockErrorMessage);
			// Act
			component['emailForm'].get('email')?.setValue(mockEmail);
			component['signUp'](mockPassword);
			tick();
			// Assert
			expect(spyCreateUser).toHaveBeenCalledTimes(1);
			expect(spyCreateUser).toHaveBeenCalledWith(mockEmail, mockPassword);
			expect(spyNavigate).not.toHaveBeenCalledTimes(1);
			expect(spyGetAuthMessage).toHaveBeenCalledWith(firebaseErrorMock);
			expect(component['signupError']()).toBe(mockErrorMessage);
			// Act
			component['resetError']();
			// Assert
			expect(component['signupError']()).toBe(AuthenticationMessages.None);
		}));
	});
});
