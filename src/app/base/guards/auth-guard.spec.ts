import { AuthPipe } from '@angular/fire/auth-guard';
import { User } from '@angular/fire/auth';

import { of } from 'rxjs';
import { JestMockExtended, mock, MockProxy } from 'jest-mock-extended';

import {
	redirectAfterLogin,
	redirectNotAuthorized,
	redirectVerified,
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
	WELCOME_ROUTE,
} from './auth-guards';

describe('Auth guards', () => {
	let mockUser: MockProxy<User>;
	let redirectAfterLoginPipe: AuthPipe;
	let redirectNotAuthorizedPipe: AuthPipe;
	let redirectVerifiedPipe: AuthPipe;
	let result: string | string[] | boolean;

	beforeEach(() => {
		redirectAfterLoginPipe = redirectAfterLogin();
		redirectNotAuthorizedPipe = redirectNotAuthorized();
		redirectVerifiedPipe = redirectVerified();
	});

	describe('Email verified', () => {
		beforeEach(() => {
			JestMockExtended.configure({ ignoreProps: ['schedule'] });
			mockUser = mock<User>({
				emailVerified: true,
			});
		});

		it('returns task-board route if email verified for redirectAfterLoginPipe', () => {
			// Act
			of(mockUser)
				.pipe(redirectAfterLoginPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(TASK_BOARD_ROUTE);
		});

		it('returns true if no user for redirectAfterLoginPipe', () => {
			// Act
			of(null)
				.pipe(redirectAfterLoginPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(true);
		});

		it('returns true if email verified for redirectNotAuthorizedPipe', () => {
			// Act
			of(mockUser)
				.pipe(redirectNotAuthorizedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toBe(true);
		});

		it('returns welcome route if no user for for redirectNotAuthorizedPipe', () => {
			// Act
			of(null)
				.pipe(redirectNotAuthorizedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(WELCOME_ROUTE);
		});

		it('returns task-board route if email verified for redirectVerifiedPipe', () => {
			// Act
			of(mockUser)
				.pipe(redirectVerifiedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(TASK_BOARD_ROUTE);
		});

		it('returns welcome route if no user for for redirectVerifiedPipe', () => {
			// Act
			of(null)
				.pipe(redirectVerifiedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(WELCOME_ROUTE);
		});
	});

	describe('Email not verified', () => {
		beforeEach(() => {
			JestMockExtended.configure({ ignoreProps: ['schedule'] });
			mockUser = mock<User>({
				emailVerified: false,
			});
		});

		it('returns verify-email route if email not verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectAfterLoginPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(VERIFY_EMAIL_ROUTE);
		});

		it('returns verify-email route if email not verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectNotAuthorizedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(VERIFY_EMAIL_ROUTE);
		});

		it('returns true if email not verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectVerifiedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toBe(true);
		});
	});
});
