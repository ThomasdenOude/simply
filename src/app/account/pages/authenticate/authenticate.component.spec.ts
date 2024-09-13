import { AuthenticateComponent } from './authenticate.component';
import {
	MockBuilder,
	MockedComponentFixture,
	MockInstance,
	MockRender,
} from 'ng-mocks';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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
		const mockUser = mock<User>();
		const mockCode = 'mockCode';
		const mockQueryParams: [string, string][] = [
			['mode', 'verifyEmail'],
			['oobCode', mockCode],
		];

		it('sends email verification code', fakeAsync(() => {
			// Arrange
			setupWithQueryParamsAndUser(mockQueryParams, mockUser);
			tick();
			fixture.detectChanges();
			const title = dataTest('verify-email-title');
			const continueMessage = dataTestIf('continue-verify-message');
			const verifiedButton = dataTest('email-verified-button');
			const errorMessage = dataTestIf('verify-email-message');
			const resetPasswordTitle = dataTestIf('reset-password-title');
			// Assert
			expect(
				authenticationService.confirmEmailVerification
			).toHaveBeenCalledTimes(1);
			expect(
				authenticationService.confirmEmailVerification
			).toHaveBeenCalledWith(mockCode);
			expect(title.nativeElement.textContent).toContain(
				'Thank you for signing up to'
			);
			expect(continueMessage).toBe(false);
			expect(verifiedButton).toBeTruthy();
			expect(errorMessage).toBe(false);
			expect(resetPasswordTitle).toBe(false);
		}));

		it('navigates to task board', fakeAsync(() => {
			// Arrange
			setupWithQueryParamsAndUser(mockQueryParams, mockUser);
			tick();
			fixture.detectChanges();
			// Stay on page but clear query params
			expect(router.navigate).toHaveBeenCalledWith([], {
				queryParams: {},
			});
			const verifiedButton = dataTest('email-verified-button');
			// Act
			verifiedButton.nativeElement.click();
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(2);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		}));

		it('shows error after confirmation error, with sent email link for user', () => {});

		it('Ask user to log in again if no credentials available', () => {});
	});
});
