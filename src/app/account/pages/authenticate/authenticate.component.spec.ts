import { AuthenticateComponent } from './authenticate.component';
import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockInstance,
	MockRender,
} from 'ng-mocks';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { fakeAsync, TestBed } from '@angular/core/testing';
import {
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
	WELCOME_ROUTE,
} from '../../../base/guards/auth-guards';
import { RouterMock } from '../../../../test/mocks/router.mock';
import { AuthenticationServiceMock } from '../../services/authentication-service/authentication.service.mock';
import { User } from '@angular/fire/auth';
import { mock } from 'jest-mock-extended';
import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import { ConfirmVerifyEmailComponent } from '../../ui/confirm-verify-email/confirm-verify-email.component';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { ConfirmResetPasswordComponent } from '../../ui/confirm-reset-password/confirm-reset-password.component';

describe('AuthenticateComponent', () => {
	let fixture: MockedComponentFixture<AuthenticateComponent>;
	let mockRouter: RouterMock = new RouterMock();
	let mockAuthenticationService: AuthenticationServiceMock =
		new AuthenticationServiceMock();
	let router: Router;
	let authenticationService: AuthenticationService;

	const setupWithQueryParamsAndUser = (
		queryParams: [string, string][],
		user: User | null = null
	): void => {
		// Set queryParams
		MockInstance(ActivatedRoute, 'snapshot', jest.fn(), 'get')
			// using test.fn.mockReturnValue to customize what the getter returns.
			.mockReturnValue({
				queryParamMap: new Map(queryParams),
			});
		// Set user
		mockAuthenticationService.userSignal.set(user);
		// Render component
		fixture = MockRender(AuthenticateComponent);
		router = TestBed.inject(Router);
		authenticationService = TestBed.inject(AuthenticationService);
	};

	beforeEach(() =>
		MockBuilder(AuthenticateComponent, [
			AuthenticationService,
			Router,
			ActivatedRoute,
			CenterPageComponent,
			MessageComponent,
			NewPasswordComponent,
		])
			.mock(Router, mockRouter)
			.mock(AuthenticationService, mockAuthenticationService)
			.mock(ActivatedRoute)
	);

	afterEach(() => {
		MockInstance(ActivatedRoute);
		jest.clearAllMocks();
	});

	describe('No query params', () => {
		it('redirects to welcome page if no user provided', () => {
			// Arrange
			setupWithQueryParamsAndUser([]);
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(WELCOME_ROUTE);
		});

		it('redirects to verify email page if user not verified', () => {
			// Arrange
			const mockUser = mock<User>({
				emailVerified: false,
			});
			setupWithQueryParamsAndUser([], mockUser);
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(VERIFY_EMAIL_ROUTE);
		});

		it('redirects to task board page if user verified', () => {
			// Arrange
			const mockUser = mock<User>({
				emailVerified: true,
			});
			setupWithQueryParamsAndUser([], mockUser);
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});
	});

	describe('Verify email', () => {
		// Arrange
		let confirmVerifyEmail: MockedDebugElement<ConfirmVerifyEmailComponent>;
		const mockUser = mock<User>();
		const mockCode = 'mockCode';
		const mockQueryParams: [string, string][] = [
			['mode', 'verifyEmail'],
			['oobCode', mockCode],
		];
		beforeEach(() => {
			// Arrange
			setupWithQueryParamsAndUser(mockQueryParams, mockUser);
			fixture.detectChanges();
			confirmVerifyEmail = dataTest('confirm-verify-email');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('shows confirm verify email', () => {
			// Assert
			expect(confirmVerifyEmail).toBeTruthy();
			expect(confirmVerifyEmail.componentInstance.user).toEqual(mockUser);
			expect(confirmVerifyEmail.componentInstance.emailCodeConfirmed).toBe(
				false
			);
			expect(confirmVerifyEmail.componentInstance.emailVerificationError).toBe(
				AuthenticationMessages.None
			);
		});

		it('goes to app', () => {
			// Act
			confirmVerifyEmail.componentInstance.goToApp.emit();
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('calls send Email verification', () => {
			// Act
			confirmVerifyEmail.componentInstance.sendVerificationLink.emit(mockUser);
			// Assert
			expect(authenticationService.sendEmailVerification).toHaveBeenCalledTimes(
				1
			);
			expect(authenticationService.sendEmailVerification).toHaveBeenCalledWith(
				mockUser
			);
		});
	});

	describe('Confirm reset password', () => {
		// Arrange
		let confirmResetPassword: MockedDebugElement<ConfirmResetPasswordComponent>;
		const mockUser = mock<User>({
			emailVerified: false,
		});
		const mockCode = 'mockCode';
		const mockQueryParams: [string, string][] = [
			['mode', 'resetPassword'],
			['oobCode', mockCode],
		];

		beforeEach(() => {
			setupWithQueryParamsAndUser(mockQueryParams, mockUser);
			fixture.detectChanges();
			confirmResetPassword = dataTest('confirm-reset-password');
		});

		afterEach(() => {
			jest.restoreAllMocks();
		});

		it('shows confirm reset password', fakeAsync(() => {
			// Assert
			expect(confirmResetPassword).toBeTruthy();
			expect(confirmResetPassword.componentInstance.passwordCodeConfirmed).toBe(
				false
			);
			expect(confirmResetPassword.componentInstance.passwordConfirmed).toBe(
				false
			);
			expect(confirmResetPassword.componentInstance.passwordError).toBe(
				AuthenticationMessages.None
			);
		}));

		it('goes to app', () => {
			// Act
			confirmResetPassword.componentInstance.goToApp.emit();
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('calls reset password', () => {
			// Act
			confirmResetPassword.componentInstance.resetPassword.emit('test');
			// Assert
			expect(authenticationService.confirmPasswordReset).toHaveBeenCalledTimes(
				1
			);
			expect(authenticationService.confirmPasswordReset).toHaveBeenCalledWith(
				mockCode,
				'test'
			);
		});
	});
});
