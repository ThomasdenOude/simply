import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { TestParams } from '../../../jest/test-models/test-params.model';
import {
	dataTest,
	dataTestIf,
} from '../../../jest/test-helpers/data-test.helper';

import { ConfirmResetPasswordComponent } from './confirm-reset-password.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { NewPasswordComponent } from '../new-password/new-password.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { AuthenticationMessages } from '../../models/authentication-messages';

describe('ConfirmResetPasswordComponent', () => {
	let component: ConfirmResetPasswordComponent;
	let fixture: MockedComponentFixture<
		ConfirmResetPasswordComponent,
		TestParams
	>;

	beforeEach(() =>
		MockBuilder(ConfirmResetPasswordComponent, [
			MessageComponent,
			NewPasswordComponent,
			SpaceContentDirective,
		])
	);

	describe('Password code and password not confirmed', () => {
		beforeEach(() => {
			const params = {
				passwordCodeConfirmed: false,
				passwordConfirmed: false,
				passwordError: AuthenticationMessages.None,
			};
			fixture = MockRender<ConfirmResetPasswordComponent>(
				ConfirmResetPasswordComponent,
				params
			);
		});

		it('does not show any error if no error is set', () => {
			// Arrange
			const message = dataTestIf('reset-password-message');
			// Assert
			expect(message).toBe(false);
		});

		it('shows verify message', () => {
			// Arrange
			const verifyMessage = dataTest('verifying-message');
			// Assert
			expect(verifyMessage).toBeTruthy();
			expect(verifyMessage.nativeElement.textContent).toBe(
				'We will verify the password reset link'
			);
		});

		it('does not show new password form or continue button', () => {
			// Arrange
			const newPassword = dataTestIf('new-password');
			const continueButton = dataTestIf('go-to-app-button');
			// Assert
			expect(newPassword).toBe(false);
			expect(continueButton).toBe(false);
		});
	});

	describe('Error message', () => {
		beforeEach(() => {
			const params = {
				passwordCodeConfirmed: false,
				passwordConfirmed: false,
				passwordError: AuthenticationMessages.InvalidPassword,
			};
			fixture = MockRender<ConfirmResetPasswordComponent>(
				ConfirmResetPasswordComponent,
				params
			);
		});

		it('shows the password error message', () => {
			// Arrange
			const message: MockedDebugElement<MessageComponent> = ngMocks.find([
				'data-test',
				'password-message',
			]);
			// Assert
			expect(message.componentInstance.errorMessage).toBe(
				AuthenticationMessages.InvalidPassword
			);
		});
	});

	describe('Password code confirmed, password not confirmed', () => {
		beforeEach(() => {
			const params = {
				passwordCodeConfirmed: true,
				passwordConfirmed: false,
				passwordError: AuthenticationMessages.None,
			};
			fixture = MockRender<ConfirmResetPasswordComponent>(
				ConfirmResetPasswordComponent,
				params
			);
			component = fixture.point.componentInstance;
		});

		it('does not show verify message', () => {
			// Arrange
			const verifyMessage = dataTestIf('verifying-message');
			// Assert
			expect(verifyMessage).toBe(false);
		});

		it('shows new password form, but not the go to app button', () => {
			// Arrange
			const newPassword = dataTestIf('new-password');
			const continueButton = dataTestIf('go-to-app-button');
			// Assert
			expect(newPassword).toBeTruthy();
			expect(continueButton).toBe(false);
		});

		it('Emits new password if new password is submitted', () => {
			// Arrange
			const resetPasswordSpy = jest.spyOn(component.resetPassword, 'emit');
			const newPassword: MockedDebugElement<NewPasswordComponent> =
				ngMocks.find(['data-test', 'new-password']);
			// Act
			newPassword.componentInstance.isSubmitted.emit('mock-password');
			// Assert
			expect(resetPasswordSpy).toHaveBeenCalledTimes(1);
			expect(resetPasswordSpy).toHaveBeenCalledWith('mock-password');
		});
	});

	describe('Password code and password confirmed', () => {
		beforeEach(() => {
			const params = {
				passwordCodeConfirmed: true,
				passwordConfirmed: true,
				passwordError: AuthenticationMessages.None,
			};
			fixture = MockRender<ConfirmResetPasswordComponent>(
				ConfirmResetPasswordComponent,
				params
			);
			component = fixture.point.componentInstance;
		});

		it('emits go to app when continue button clicked', () => {
			// Arrange
			const goToAppSpy = jest.spyOn(component.goToApp, 'emit');
			const button = dataTest('go-to-app-button');
			// Act
			button.nativeElement.click();
			// Assert
			expect(goToAppSpy).toHaveBeenCalledTimes(1);
		});
	});
});
