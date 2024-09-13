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

		it('returns task-board route if email verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectAfterLoginPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(TASK_BOARD_ROUTE);
		});

		it('returns true if email verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectNotAuthorizedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toBe(true);
		});

		it('returns task-board route if email verified', () => {
			// Act
			of(mockUser)
				.pipe(redirectVerifiedPipe)
				.subscribe(path => {
					result = path;
				});
			// Assert
			expect(result).toEqual(TASK_BOARD_ROUTE);
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
