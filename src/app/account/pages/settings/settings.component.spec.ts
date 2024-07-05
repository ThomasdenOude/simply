import { RouterModule } from '@angular/router';
import { signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

import { of } from 'rxjs';
import { Dialog } from '@angular/cdk/dialog';
import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import SpyInstance = jest.SpyInstance;
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../../services/authentication.service';
import { SettingsComponent } from './settings.component';
import { RemoveAccountComponent } from '../../ui/remove-account/remove-account.component';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { firebaseErrorMock } from '../../../jest/test-mocks/firebase-error.mock';

describe('SettingsComponent', () => {
	const noErrorMessage: AuthenticationMessages = AuthenticationMessages.None;
	const mockUser: MockProxy<User> = mock<User>();
	const mockPassword = 'mockPassword';
	let component: SettingsComponent;
	let fixture: MockedComponentFixture<SettingsComponent>;
	let spyNavigate: SpyInstance;
	let spyLogout: SpyInstance;
	let spyAuthMessage: SpyInstance;

	beforeEach(() =>
		MockBuilder(
			[SettingsComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[AuthenticationService, Dialog]
		).mock(AuthenticationService, {
			user: signal(mockUser),
		})
	);

	beforeEach(() => {
		fixture = MockRender(SettingsComponent);
		component = fixture.point.componentInstance;
		spyNavigate = jest
			.spyOn(component['router'], 'navigate')
			.mockResolvedValue(true);
		spyLogout = jest.spyOn(component['authService'], 'logout');
		spyAuthMessage = jest.spyOn(
			component['authService'],
			'getAuthenticationMessage'
		);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should set default values', () => {
		// Assert
		expect(component['changePasswordMessage']()).toBe(noErrorMessage);
		expect(component['continuePasswordChange']()).toBe(false);
		expect(component['removeAccountError']()).toBe(noErrorMessage);
		expect(component['passwordConfirmError']()).toBe(noErrorMessage);
	});

	it('should navigate sot "sign in" page on successful logout', fakeAsync(() => {
		// Arrange
		spyLogout.mockReturnValue(Promise.resolve());
		spyNavigate.mockResolvedValue(true);
		// Act
		component['logout']();
		tick();
		// Assert
		expect(spyLogout).toHaveBeenCalledTimes(1);
		expect(spyNavigate).toHaveBeenCalledWith(['/sign-in']);
	}));

	it('should not navigate after failed logout', fakeAsync(() => {
		// Arrange
		spyLogout.mockReturnValue(Promise.reject(firebaseErrorMock));
		// Act
		component['logout']();
		tick();
		// Assert
		expect(spyLogout).toHaveBeenCalledTimes(1);
		expect(spyNavigate).not.toHaveBeenCalled();
	}));

	describe('Confirm password', () => {
		const mockEmail = mockUser.email;
		let spyLogin: SpyInstance;

		beforeEach(() => {
			spyLogin = jest.spyOn(component['authService'], 'loginAndVerifyEmail');
		});

		it('should open remove account dialog', fakeAsync(() => {
			// Arrange
			spyLogin.mockReturnValue(Promise.resolve());
			// Act
			component['confirmPassword']('mockPassword', 'RemoveAccount');
			tick();
			// Assert
			expect(spyLogin).toHaveBeenCalledTimes(1);
			expect(spyLogin).toHaveBeenCalledWith(mockEmail, mockPassword);
			expect(component['dialog'].open).toHaveBeenCalledTimes(1);
			expect(component['dialog'].open).toHaveBeenCalledWith(
				RemoveAccountComponent
			);
		}));

		it('should set continuePasswordChange to true', fakeAsync(() => {
			// Arrange
			spyLogin.mockReturnValue(Promise.resolve());
			// Act
			component['confirmPassword']('mockPassword', 'ChangePassword');
			tick();
			// Assert
			expect(component['continuePasswordChange']()).toBe(true);
		}));

		it('should set passwordConfirmError on failed password confirm', fakeAsync(() => {
			// Arrange
			spyLogin.mockReturnValue(Promise.reject(firebaseErrorMock));
			const mockAuthMessage: AuthenticationMessages =
				AuthenticationMessages.InvalidPassword;
			spyAuthMessage.mockReturnValue(mockAuthMessage);
			// Act
			component['confirmPassword']('mockPassword', 'ChangePassword');
			tick();
			// Assert
			expect(component['passwordConfirmError']()).toBe(mockAuthMessage);
		}));
	});

	describe('Remove account', () => {
		let spyOpen: SpyInstance;
		let spyDelete: SpyInstance;

		beforeEach(() => {
			spyOpen = jest.spyOn(component['dialog'], 'open');
			spyDelete = jest.spyOn(component['authService'], 'deleteUser');
		});

		it('should delete user and logout', fakeAsync(() => {
			// Arrange
			spyOpen.mockReturnValue({
				closed: of(true),
			});
			spyDelete.mockReturnValue(Promise.resolve());
			spyLogout.mockReturnValue(Promise.resolve());

			// Act
			component['openRemoveAccountDialog']();
			tick();
			// Assert
			expect(spyOpen).toHaveBeenCalledTimes(1);
			expect(spyOpen).toHaveBeenCalledWith(RemoveAccountComponent);
			expect(spyDelete).toHaveBeenCalledTimes(1);
			expect(spyDelete).toHaveBeenCalledWith(mockUser);
			expect(spyLogout).toHaveBeenCalledTimes(1);
			expect(component['removeAccountError']()).toBe(noErrorMessage);
		}));

		it('should show failed delete message on failed delete', fakeAsync(() => {
			// Arrange
			spyOpen.mockReturnValue({
				closed: of(true),
			});
			spyDelete.mockReturnValue(Promise.reject(firebaseErrorMock));
			// Act
			component['openRemoveAccountDialog']();
			tick();
			// Assert
			expect(spyLogout).not.toHaveBeenCalled();
			expect(component['removeAccountError']()).toBe(
				AuthenticationMessages.FailedDeleteUser
			);
		}));

		it('should show failed delete message when no user available for delete', fakeAsync(() => {
			// Arrange
			spyOpen.mockReturnValue({
				closed: of(true),
			});
			spyDelete.mockReturnValue(Promise.resolve());
			const spyUser: SpyInstance = jest
				.spyOn(component['authService'], 'user')
				.mockReturnValue(null);
			// Act
			component['openRemoveAccountDialog']();
			tick();
			// Assert
			expect(spyDelete).not.toHaveBeenCalled();
			expect(component['removeAccountError']()).toBe(
				AuthenticationMessages.FailedDeleteUser
			);
		}));

		it('should not delete when dialog closes with false', () => {
			// Arrange
			spyOpen.mockReturnValue({
				closed: of(false),
			});
			// Act
			component['openRemoveAccountDialog']();
			// Assert
			expect(spyDelete).not.toHaveBeenCalled();
			expect(component['removeAccountError']()).toBe(noErrorMessage);
		});
	});

	describe('Change password', () => {
		let spyChangePassword: SpyInstance;
		beforeEach(() => {
			spyChangePassword = jest.spyOn(
				component['authService'],
				'changePassword'
			);
		});

		it('should change password and set success message', fakeAsync(() => {
			// Arrange
			spyChangePassword.mockReturnValue(Promise.resolve());
			// Act
			component['submitChangePassword'](mockPassword);
			tick();
			// Assert
			expect(spyChangePassword).toHaveBeenCalledTimes(1);
			expect(spyChangePassword).toHaveBeenCalledWith(mockUser, mockPassword);
			expect(component['changePasswordMessage']()).toBe(
				AuthenticationMessages.SuccessfulPasswordChange
			);
		}));

		it('should set error after failed change password', fakeAsync(() => {
			// Arrange
			spyChangePassword.mockReturnValue(Promise.reject(firebaseErrorMock));
			spyAuthMessage.mockReturnValue(AuthenticationMessages.Default);
			// Act
			component['submitChangePassword'](mockPassword);
			tick();
			// Assert
			expect(spyChangePassword).toHaveBeenCalledTimes(1);
			expect(spyAuthMessage).toHaveBeenCalledWith(firebaseErrorMock);
			expect(component['changePasswordMessage']()).toBe(
				AuthenticationMessages.Default
			);
		}));

		it('should set error when no user available for change password', fakeAsync(() => {
			// Act
			const spyUser = jest
				.spyOn(component['authService'], 'user')
				.mockReturnValue(null);
			// Act
			component['submitChangePassword'](mockPassword);
			tick();
			// Assert
			expect(spyChangePassword).not.toHaveBeenCalled();
			expect(component['changePasswordMessage']()).toBe(
				AuthenticationMessages.Default
			);
		}));
	});
});
