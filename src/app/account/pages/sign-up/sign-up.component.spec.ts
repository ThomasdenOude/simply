import { Router, RouterModule } from '@angular/router';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FirebaseError } from '@firebase/util';
import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
	ngMocks,
} from 'ng-mocks';

import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import { RouterMock } from '../../../../test/mocks/router.mock';
import { ResponsiveServiceMock } from '../../../base/services/responsive.service.mock';
import { AuthenticationServiceMock } from '../../services/authentication-service/authentication.service.mock';

import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { SignUpComponent } from './sign-up.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { VERIFY_EMAIL_ROUTE } from '../../../base/guards/auth-guards';

describe('SignUpComponent', () => {
	let component: SignUpComponent;
	let fixture: MockedComponentFixture<SignUpComponent>;
	const mockRouter: RouterMock = new RouterMock();
	const mockResponsiveService: ResponsiveServiceMock =
		new ResponsiveServiceMock();
	const mockAuthService: AuthenticationServiceMock =
		new AuthenticationServiceMock();

	beforeEach(() =>
		MockBuilder(
			[SignUpComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[
				AuthenticationService,
				ResponsiveService,
				MessageComponent,
				NewPasswordComponent,
			]
		)
			.mock(Router, mockRouter)
			.mock(AuthenticationService, mockAuthService)
			.mock(ResponsiveService, mockResponsiveService)
	);

	beforeEach(() => {
		fixture = MockRender(SignUpComponent);
		component = fixture.point.componentInstance;
	});

	it('renders default component state', () => {
		// Arrange
		const title = dataTest('sign-up-title');
		const error = dataTestIf('sign-up-error');
		const loginButton = dataTestIf('log-in-button');
		const continueButton = dataTest('continue-button');
		const newPassword = dataTestIf('new-password');
		// Assert
		expect(title.nativeElement.textContent).toContain('Sign up to Simply');
		expect(error).toBe(false);
		expect(loginButton).toBe(false);
		expect(continueButton).toBeTruthy();
		expect(continueButton.attributes['type']).toBe('submit');
		expect(newPassword).toBe(false);
	});

	it('should set default values', () => {
		// Assert
		expect(component['device']()).toBe(Devices.Unknown);
		expect(component['emailChange']()).toBeFalsy();
		expect(component['continue']()).toBe(false);
		expect(component['signupError']()).toBe(AuthenticationMessages.None);
	});

	describe('Email form', () => {
		let emailInput: MockedDebugElement;
		let continueButton: MockedDebugElement;
		let authService: AuthenticationService;
		let router: Router;

		beforeEach(() => {
			emailInput = dataTest('email-input');
			continueButton = dataTest('continue-button');
			authService = TestBed.inject(AuthenticationService);
			router = TestBed.inject(Router);
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should not continue if no email submitted', () => {
			// Act
			continueButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const required = dataTest('email-required-error');
			continueButton = dataTest('continue-button');
			const newPassword = dataTestIf('new-password');
			// Assert
			expect(required).toBeTruthy();
			expect(required.nativeElement.textContent).toContain(
				'Fill in your email'
			);
			expect(continueButton).toBeTruthy();
			expect(newPassword).toBe(false);
		});

		it('should not continue if invalid email submitted', () => {
			// Act
			emailInput.nativeElement.value = 'mock';
			ngMocks.trigger(emailInput, 'input');
			continueButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const format = dataTest('email-format-error');
			// Assert
			expect(format).toBeTruthy();
			expect(format.nativeElement.textContent).toContain(
				'Fill in a valid email'
			);
		});

		it('should continue with email and submit form', fakeAsync(() => {
			// Arrange
			const email = 'mock@mail.com';
			const password = 'mockPassword';
			// Act
			emailInput.nativeElement.value = email;
			ngMocks.trigger(emailInput, 'input');
			continueButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const format = dataTestIf('email-format-error');
			const continueButtonAfterSubmit = dataTestIf('continue-button');
			const newPassword: MockedDebugElement<NewPasswordComponent> =
				dataTest('new-password');
			// Assert
			expect(format).toBe(false);
			expect(continueButtonAfterSubmit).toBe(false);
			expect(newPassword).toBeTruthy();
			expect(newPassword.componentInstance.newPasswordSubmitText).toBe(
				'Sign up'
			);
			// Act
			newPassword.componentInstance.isSubmitted.emit(password);
			tick();
			// Assert
			expect(authService.creatUserAndVerifyEmail).toHaveBeenCalledTimes(1);
			expect(authService.creatUserAndVerifyEmail).toHaveBeenCalledWith(
				email,
				password
			);
			expect(router.navigate).toHaveBeenCalledWith(VERIFY_EMAIL_ROUTE);
		}));

		it('should show error', fakeAsync(() => {
			// Arrange
			const email = 'mock@mail.com';
			const password = 'mockPassword';
			const error = new FirebaseError(
				'auth/email-already-in-use',
				'Email already in use'
			);
			ngMocks.stubMember(
				authService,
				'creatUserAndVerifyEmail',
				jest.fn(() => Promise.reject(error))
			);
			ngMocks.stubMember(
				authService,
				'getAuthenticationMessage',
				jest.fn(() => AuthenticationMessages.EmailExists)
			);
			// Act
			emailInput.nativeElement.value = email;
			ngMocks.trigger(emailInput, 'input');
			continueButton.nativeElement.click();
			fixture.detectChanges();
			// Arrange
			const newPassword: MockedDebugElement<NewPasswordComponent> =
				dataTest('new-password');
			// Act
			newPassword.componentInstance.isSubmitted.emit(password);
			tick();
			fixture.detectChanges();
			// Assert
			expect(authService.creatUserAndVerifyEmail).toHaveBeenCalledTimes(1);
			expect(authService.creatUserAndVerifyEmail).toHaveBeenCalledWith(
				email,
				password
			);
			// Arrange
			const message: MockedDebugElement<MessageComponent> =
				dataTest('sign-up-error');
			// Assert
			expect(authService.getAuthenticationMessage).toHaveBeenCalledWith(error);
			expect(message).toBeTruthy();
			expect(message.componentInstance.errorMessage).toBe(
				AuthenticationMessages.EmailExists
			);
			// Act
			message.componentInstance.onClose.emit();
			fixture.detectChanges();
			// Arrange
			const messageAfterClose = dataTestIf('sign-up-error');
			// Assert
			expect(messageAfterClose).toBe(false);
		}));
	});
});
