import { Router, RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockInstance,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
	ngMocks,
} from 'ng-mocks';

import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import { RouterMock } from '../../../../test/mocks/router.mock';
import { firebaseErrorMock } from '../../../../test/mocks/firebase-error.mock';
import { ResponsiveServiceMock } from '../../../base/services/responsive.service.mock';
import { AuthenticationServiceMock } from '../../services/authentication-service/authentication.service.mock';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { LoginComponent } from './login.component';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import {
	TASK_BOARD_ROUTE,
	VERIFY_EMAIL_ROUTE,
} from '../../../base/guards/auth-guards';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: MockedComponentFixture<LoginComponent>;
	let authenticationService: AuthenticationService;
	let router: Router;

	const mockRouter: RouterMock = new RouterMock();
	const mockResponsiveService: ResponsiveServiceMock =
		new ResponsiveServiceMock();
	const mockAuthenticationService: AuthenticationServiceMock =
		new AuthenticationServiceMock();

	let emailInput: MockedDebugElement;
	let passwordInput: MockedDebugElement;
	let submitButton: MockedDebugElement;

	beforeEach(() =>
		MockBuilder(
			[LoginComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[
				Router,
				AuthenticationService,
				ResponsiveService,
				MessageComponent,
				CenterPageComponent,
				Dialog,
				DialogRef,
				MatSnackBar,
			]
		)
			.mock(Router, mockRouter)
			.mock(ResponsiveService, mockResponsiveService)
			.mock(AuthenticationService, mockAuthenticationService)
	);

	beforeEach(() => {
		// Arrange
		jest.clearAllMocks();

		fixture = MockRender(LoginComponent);
		component = fixture.point.componentInstance;
		authenticationService = TestBed.inject(AuthenticationService);
		router = TestBed.inject(Router);
		fixture.detectChanges();

		emailInput = dataTest('email-input');
		passwordInput = dataTest('password-input');
		submitButton = dataTest('submit-button');
	});

	it('shows title and no message', () => {
		// Arrange
		const title = dataTest('login-title');
		const message = dataTestIf('login-message');
		// Assert
		expect(title.nativeElement.textContent).toContain('Log in to Simply');
		expect(message).toBe(false);
	});

	describe('Log in', () => {
		beforeEach(() => {
			// Act
			emailInput.nativeElement.value = 'mock@mail.com';
			ngMocks.trigger(emailInput, 'input');
			passwordInput.nativeElement.value = 'mockPassword';
			ngMocks.trigger(passwordInput, 'input');
		});

		it('logs user in', () => {
			// Act
			submitButton.nativeElement.click();
			fixture.detectChanges();
			// Assert
			expect(authenticationService.loginAndVerifyEmail).toHaveBeenCalledTimes(
				1
			);
			expect(authenticationService.loginAndVerifyEmail).toHaveBeenCalledWith(
				'mock@mail.com',
				'mockPassword'
			);
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('goes to verify email page if user not verified', () => {
			// Arrange
			ngMocks.stubMember(
				authenticationService,
				'loginAndVerifyEmail',
				jest.fn(() => Promise.resolve(false))
			);
			// Act
			submitButton.nativeElement.click();
			fixture.detectChanges();
			// Assert
			expect(router.navigate).toHaveBeenCalledWith(VERIFY_EMAIL_ROUTE);
		});

		it('shows message on login error', () => {
			// Arrange
			ngMocks.stubMember(
				authenticationService,
				'loginAndVerifyEmail',
				jest.fn(() => Promise.reject(firebaseErrorMock))
			);
			ngMocks.stubMember(
				authenticationService,
				'getAuthenticationMessage',
				jest.fn(() => AuthenticationMessages.InvalidPassword)
			);
			// Act
			submitButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const message: MockedDebugElement<MessageComponent> =
				dataTest('login-message');
			// Assert
			expect(router.navigate).not.toHaveBeenCalled();
			expect(message.componentInstance.errorMessage).toBe(
				AuthenticationMessages.InvalidPassword
			);
			// Act
			message.componentInstance.closeMessage.emit();
			fixture.detectChanges();
			// Arrange
			const messageAfterClose = dataTestIf('login-message');
			// Assert
			expect(messageAfterClose).toBe(false);
		});
	});

	describe('Input errors', () => {
		it('shows required errors', () => {
			// Act
			submitButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const emailRequired = dataTest('email-required-error');
			const passwordRequired = dataTest('password-required-error');
			// Assert
			expect(emailRequired).toBeTruthy();
			expect(passwordRequired).toBeTruthy();
		});

		it('shows email format error', () => {
			// Act
			emailInput.nativeElement.value = 'name';
			ngMocks.trigger(emailInput, 'input');
			submitButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const emailFormat = dataTest('email-format-error');
			// Assert
			expect(emailFormat).toBeTruthy();
		});
	});

	it('goes tot sign up page', () => {
		// Arrange
		const creatAccount = dataTest('create-account-link');
		// Assert
		expect(creatAccount.attributes['routerLink']).toBe('/account/sign-up');
	});

	describe('Forgot password', () => {
		let snackbar: MatSnackBar;
		let dialogRef: DialogRef;
		let dialog: Dialog;
		let forgotPasswordButton: MockedDebugElement;

		beforeEach(() => {
			// Arrange
			MockInstance(DialogRef, () => ({
				closed: of('mock@mail.com'),
			}));
			snackbar = TestBed.inject(MatSnackBar);
			dialogRef = TestBed.inject(DialogRef);
			dialog = TestBed.inject(Dialog);
			ngMocks.stubMember(
				dialog,
				'open',
				jest.fn(() => dialogRef)
			);
			forgotPasswordButton = dataTest('forgot-password-button');
		});

		afterEach(() => {
			MockInstance(DialogRef);
		});

		it('opens forgot password dialog and sends password reset', () => {
			// Act
			forgotPasswordButton.nativeElement.click();
			fixture.detectChanges();
			// Assert
			expect(dialog.open).toHaveBeenCalledTimes(1);
			expect(authenticationService.sendPasswordReset).toHaveBeenCalledTimes(1);
			expect(authenticationService.sendPasswordReset).toHaveBeenCalledWith(
				'mock@mail.com'
			);
			expect(snackbar.open).toHaveBeenCalledTimes(1);
			expect(snackbar.open).toHaveBeenCalledWith(
				'An email to reset your password was send to: mock@mail.com',
				'',
				{ duration: 5000 }
			);
		});
		it('shows send password reset error', () => {
			// Arrange
			ngMocks.stubMember(
				authenticationService,
				'sendPasswordReset',
				jest.fn(() => Promise.reject())
			);
			// Act
			forgotPasswordButton.nativeElement.click();
			fixture.detectChanges();
			// Assert
			expect(snackbar.open).toHaveBeenCalledWith(
				'Unable to send email to: mock@mail.com',
				'',
				{ duration: 5000 }
			);
		});
	});
});
