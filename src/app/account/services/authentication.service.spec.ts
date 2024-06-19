import {
	Auth,
	authState,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	User,
	UserCredential,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';
import { Subject } from 'rxjs';

import { MockBuilder, MockRender } from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';

import { AuthenticationService } from './authentication.service';
import { AuthenticationMessages } from '../models/authentication-messages';
import { authenticationErrorMap } from '../data/authentication-messages.map';
import { mockError } from '../../base/test-mocks/mock-error';

jest.mock('@angular/fire/auth');

describe('AuthenticationService', () => {
	let service: AuthenticationService;
	let mockUserSubject$: Subject<User | null> = new Subject<User | null>();
	// Mocked data
	const mockUser: MockProxy<User> = mock<User>();
	const mockUserCredential: MockProxy<UserCredential> = mock<UserCredential>();
	const mockEmail = 'mockEmail';
	const mockPassword = 'mockPassword';

	// Spy on firebase auth module functions
	const mockAuthState: jest.MockedFn<typeof authState> = jest.mocked(
		authState,
		{ shallow: true }
	);
	const mockCreateUser: jest.MockedFn<typeof createUserWithEmailAndPassword> =
		jest.mocked(createUserWithEmailAndPassword, { shallow: true });
	const mockSignOut: jest.MockedFn<typeof signOut> = jest.mocked(signOut, {
		shallow: true,
	});
	const mockSignIn: jest.MockedFn<typeof signInWithEmailAndPassword> =
		jest.mocked(signInWithEmailAndPassword, { shallow: true });
	const mockUpdatePassword: jest.MockedFn<typeof updatePassword> = jest.mocked(
		updatePassword,
		{ shallow: true }
	);

	beforeEach(async () => {
		mockAuthState.mockReturnValue(mockUserSubject$.asObservable());

		return MockBuilder(AuthenticationService, Auth);
	});

	beforeEach(() => {
		service = MockRender(AuthenticationService).point.componentInstance;
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

	it('should call create user', () => {
		// Arrange
		mockCreateUser.mockReturnValue(Promise.resolve(mockUserCredential));
		// Act
		service.creatUserAndVerifyEmail(mockEmail, mockPassword);
		// Assert
		expect(mockCreateUser).toHaveBeenCalledTimes(1);
		expect(mockCreateUser).toHaveBeenCalledWith(
			service['auth'],
			mockEmail,
			mockPassword
		);
	});

	it('should call sign in', () => {
		// Arrange
		mockSignIn.mockReturnValue(Promise.resolve(mockUserCredential));
		// Act
		service.loginAndVerifyEmail(mockEmail, mockPassword);
		// Assert
		expect(mockSignIn).toHaveBeenCalledTimes(1);
		expect(mockSignIn).toHaveBeenCalledWith(
			service['auth'],
			mockEmail,
			mockPassword
		);
	});

	it('should call sign out', () => {
		// Arrange
		mockSignOut.mockReturnValue(Promise.resolve());
		// Act
		service.logout();
		// Assert
		expect(mockSignOut).toHaveBeenCalledTimes(1);
		expect(mockSignOut).toHaveBeenCalledWith(service['auth']);
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
			service.getAuthenticationMessage(mockError);
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
});
