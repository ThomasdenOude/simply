import { fakeAsync, tick } from '@angular/core/testing';

import { Auth, User, UserCredential } from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';
import { Subject } from 'rxjs';

import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationService } from './authentication.service';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { authenticationErrorMap } from '../../data/authentication-messages.map';
import { firebaseErrorMock } from '../../../../test/mocks/firebase-error.mock';
import {
	mockAuthState,
	mockCreateUser,
	mockSignIn,
	mockSignOut,
	mockSendEmailVerification,
	mockUpdatePassword,
	mockConfirmPasswordReset,
	mockVerifyPasswordResetCode,
	mockApplyActionCode,
	mockDeleteUser,
	mockSendPasswordResetEmail,
} from './mock-auth-functions';

jest.mock('@angular/fire/auth');

describe('AuthenticationService', () => {
	let service: AuthenticationService;
	let auth: Auth;
	let mockUserSubject$: Subject<User | null> = new Subject<User | null>();
	// Mocked data
	const mockUser: MockProxy<User> = mock<User>({
		emailVerified: true,
	});
	const mockUserCredential: MockProxy<UserCredential> = mock<UserCredential>({
		user: mockUser,
	});
	const mockEmail = 'mockEmail';
	const mockPassword = 'mockPassword';

	beforeEach(async () => {
		mockAuthState.mockReturnValue(mockUserSubject$.asObservable());

		return MockBuilder(AuthenticationService, Auth);
	});

	beforeEach(() => {
		service = MockRender(AuthenticationService).point.componentInstance;
		auth = ngMocks.findInstance(Auth);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should not be logged in when no user provided', () => {
		expect(service.isLoggedIn()).toBe(false);
		expect(service.user()).toBe(null);
	});

	it('should return logged in and provide user', () => {
		// Act
		mockUserSubject$.next(mockUser);
		// Assert
		expect(service.isLoggedIn()).toBe(true);
		expect(service.user()).toBe(mockUser);
	});

	it('should call create user', fakeAsync(() => {
		// Arrange
		mockCreateUser.mockReturnValue(Promise.resolve(mockUserCredential));
		mockSendEmailVerification.mockReturnValue(Promise.resolve());
		// Act
		service.creatUserAndVerifyEmail(mockEmail, mockPassword);
		// Assert
		expect(mockCreateUser).toHaveBeenCalledTimes(1);
		expect(mockCreateUser).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
		tick();
		expect(mockSendEmailVerification).toHaveBeenCalledTimes(1);
		expect(mockSendEmailVerification).toHaveBeenCalledWith(mockUser);
	}));

	it('should call sign in', () => {
		// Arrange
		mockSignIn.mockReturnValue(Promise.resolve(mockUserCredential));
		// Act
		service.loginAndVerifyEmail(mockEmail, mockPassword);
		// Assert
		expect(mockSignIn).toHaveBeenCalledTimes(1);
		expect(mockSignIn).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
	});

	it('should call sign out', () => {
		// Arrange
		mockSignOut.mockReturnValue(Promise.resolve());
		// Act
		service.logout();
		// Assert
		expect(mockSignOut).toHaveBeenCalledTimes(1);
		expect(mockSignOut).toHaveBeenCalledWith(auth);
	});

	it('should call update password', () => {
		// Arrange
		mockUpdatePassword.mockReturnValue(Promise.resolve());
		// Act
		service.changePassword(mockUser, mockPassword);
		// Assert
		expect(mockUpdatePassword).toHaveBeenCalledTimes(1);
		expect(mockUpdatePassword).toHaveBeenCalledWith(mockUser, mockPassword);
	});

	it('should return default error message', () => {
		// Act
		const message: AuthenticationMessages =
			service.getAuthenticationMessage(firebaseErrorMock);
		// Assert
		expect(message).toBe(AuthenticationMessages.Default);
	});

	it('should return corresponding error message', () => {
		// Act
		for (const [key, value] of authenticationErrorMap) {
			const error = new FirebaseError(key, 'mockError');
			const message = service.getAuthenticationMessage(error);
			// Assert
			expect(message).toBe(value);
		}
	});

	it('should send email verification if email not verified on login', fakeAsync(() => {
		// Arrange
		const mockUser: MockProxy<User> = mock<User>({
			emailVerified: false,
		});
		const mockUserCredential: MockProxy<UserCredential> = mock<UserCredential>({
			user: mockUser,
		});
		mockSignIn.mockReturnValue(Promise.resolve(mockUserCredential));
		mockSendEmailVerification.mockReturnValue(Promise.resolve());
		// Act
		service.loginAndVerifyEmail(mockEmail, mockPassword);
		// Assert
		expect(mockSignIn).toHaveBeenCalledTimes(1);
		expect(mockSignIn).toHaveBeenCalledWith(auth, mockEmail, mockPassword);
		tick();
		expect(mockSendEmailVerification).toHaveBeenCalledTimes(1);
		expect(mockSendEmailVerification).toHaveBeenCalledWith(mockUser);
	}));

	it('should return confirmPasswordReset', () => {
		// Arrange
		mockConfirmPasswordReset.mockReturnValue(Promise.resolve());
		const mockActionCode = 'test123';
		const mockPassword = 'abc';
		// Act
		service.confirmPasswordReset(mockActionCode, mockPassword);
		// Assert
		expect(mockConfirmPasswordReset).toHaveBeenCalledTimes(1);
		expect(mockConfirmPasswordReset).toHaveBeenCalledWith(
			auth,
			mockActionCode,
			mockPassword
		);
	});

	it('should sent password Reset email', () => {
		// Arrange
		mockSendPasswordResetEmail.mockReturnValue(Promise.resolve());
		// Act
		service.sendPasswordReset(mockEmail);
		// Assert
		expect(mockSendPasswordResetEmail).toHaveBeenCalledTimes(1);
		expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(auth, mockEmail);
	});

	it('should return verifyPasswordResetCode', () => {
		// Arrange
		mockVerifyPasswordResetCode.mockReturnValue(Promise.resolve('reset'));
		const mockActionCode = 'test123';
		// Act
		service.verifyPasswordReset(mockActionCode);
		// Assert
		expect(mockVerifyPasswordResetCode).toHaveBeenCalledTimes(1);
		expect(mockVerifyPasswordResetCode).toHaveBeenCalledWith(
			auth,
			mockActionCode
		);
	});

	it('should return applyActionCode on confirmEmailVerification', () => {
		// Arrange
		mockApplyActionCode.mockReturnValue(Promise.resolve());
		const mockActionCode = 'test123';
		// Act
		service.confirmEmailVerification(mockActionCode);
		// Assert
		expect(mockApplyActionCode).toHaveBeenCalledTimes(1);
		expect(mockApplyActionCode).toHaveBeenCalledWith(auth, mockActionCode);
	});

	it('should return deleteUser', () => {
		// Arrange
		mockDeleteUser.mockReturnValue(Promise.resolve());
		// Act
		service.deleteUser(mockUser);
		// Assert
		expect(mockDeleteUser).toHaveBeenCalledTimes(1);
		expect(mockDeleteUser).toHaveBeenCalledWith(mockUser);
	});
});
