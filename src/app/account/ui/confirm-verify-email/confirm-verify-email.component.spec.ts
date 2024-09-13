import { ConfirmVerifyEmailComponent } from './confirm-verify-email.component';
import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
} from 'ng-mocks';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '@angular/fire/auth';
import { AuthenticationMessages } from '../../models/authentication-messages';
import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import SpyInstance = jest.SpyInstance;
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';

describe('ConfirmVerifyEmailComponent', () => {
	let component: ConfirmVerifyEmailComponent;
	let fixture: MockedComponentFixture<ConfirmVerifyEmailComponent, Params>;
	type Params = {
		user: User | null;
		emailCodeConfirmed: boolean;
		emailVerificationError: AuthenticationMessages;
	};

	const mockUser: MockProxy<User> = mock<User>();

	beforeEach(async () =>
		MockBuilder(ConfirmVerifyEmailComponent, [
			MessageComponent,
			SpaceContentDirective,
		])
	);

	describe('No email verification error', () => {
		const noErrorMessage = AuthenticationMessages.None;

		it('shows message if email code not yet confirmed', () => {
			// Arrange
			const params: Params = {
				user: mockUser,
				emailCodeConfirmed: false,
				emailVerificationError: noErrorMessage,
			};
			fixture = MockRender(ConfirmVerifyEmailComponent, params);
			const verifyEmailMessage = dataTest('verify-in-progress-message');
			const emailVerifiedButton = dataTestIf('email-verified-button');
			const verifyEmailError = dataTestIf('verify-email-error');
			// Asser
			expect(verifyEmailMessage).toBeTruthy();
			expect(verifyEmailMessage.nativeElement.textContent).toContain(
				'We will verify your email address'
			);
			expect(emailVerifiedButton).toBe(false);
			expect(verifyEmailError).toBe(false);
		});

		it('emits go To App on click button, when email is  confirmed', () => {
			// Arrange
			const params: Params = {
				user: mockUser,
				emailCodeConfirmed: true,
				emailVerificationError: noErrorMessage,
			};
			fixture = MockRender(ConfirmVerifyEmailComponent, params);
			component = fixture.point.componentInstance;
			const goToAppSpy: SpyInstance = jest.spyOn(component.goToApp, 'emit');
			const verifyEmailMessage = dataTestIf('verify-in-progress-message');
			const emailVerifiedButton = dataTest('email-verified-button');
			// Assert
			expect(verifyEmailMessage).toBe(false);
			expect(emailVerifiedButton).toBeTruthy();
			// Act
			emailVerifiedButton.nativeElement.click();
			// Assert
			expect(goToAppSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Email verification error', () => {
		const unverifiedEmailMessage = AuthenticationMessages.UnverifiedEmail;

		it('shows error message', () => {
			// Arrange
			const params: Params = {
				user: mockUser,
				emailCodeConfirmed: true,
				emailVerificationError: unverifiedEmailMessage,
			};
			MockRender(ConfirmVerifyEmailComponent, params);
			const errorMessage: MockedDebugElement<MessageComponent> =
				dataTest('verify-email-error');
			// Assert
			expect(errorMessage).toBeTruthy();
			expect(errorMessage.componentInstance.errorMessage).toBe(
				unverifiedEmailMessage
			);
		});

		it('can emit send verification link if user is available', () => {
			// Arrange
			const params: Params = {
				user: mockUser,
				emailCodeConfirmed: true,
				emailVerificationError: unverifiedEmailMessage,
			};
			fixture = MockRender(ConfirmVerifyEmailComponent, params);
			component = fixture.point.componentInstance;
			const sendVerificationSpy: SpyInstance = jest.spyOn(
				component.sendVerificationLink,
				'emit'
			);
			const sendVerificationLinkButton = dataTest(
				'send-verification-link-button'
			);
			const toLoginButton = dataTestIf('to-login-button');
			// Assert
			expect(toLoginButton).toBe(false);
			expect(sendVerificationLinkButton).toBeTruthy();
			// Act
			sendVerificationLinkButton.nativeElement.click();
			// Assert
			expect(sendVerificationSpy).toHaveBeenCalledTimes(1);
			expect(sendVerificationSpy).toHaveBeenCalledWith(mockUser);
		});

		it('can redirect to login if no user available', () => {
			// Arrange
			const params: Params = {
				user: null,
				emailCodeConfirmed: true,
				emailVerificationError: unverifiedEmailMessage,
			};
			fixture = MockRender(ConfirmVerifyEmailComponent, params);
			const sendVerificationLinkButton = dataTestIf(
				'send-verification-link-button'
			);
			const toLoginButton = dataTest('to-login-button');
			// Assert
			expect(sendVerificationLinkButton).toBe(false);
			expect(toLoginButton).toBeTruthy();
			expect(toLoginButton.attributes['routerLink']).toBe('/account/login');
		});
	});
});
