import { DialogRef } from '@angular/cdk/dialog';

import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { ForgotPasswordComponent } from './forgot-password.component';
import {
	dataTest,
	dataTestIf,
} from '../../../jest/test-helpers/data-test.helper';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { TextContentDirective } from '../../../base/directives/text-content.directive';

describe('ForgotPasswordComponent', () => {
	let fixture: MockedComponentFixture<ForgotPasswordComponent>;
	let dialogRef: DialogRef;
	let closeButton: MockedDebugElement;
	let emailInput: MockedDebugElement;
	let requiredError: MockedDebugElement;
	let validEmailError: MockedDebugElement;
	let sendEmailButton: MockedDebugElement;

	beforeEach(async () =>
		MockBuilder(ForgotPasswordComponent, [
			DialogRef,
			FocusInputDirective,
			SpaceContentDirective,
			TextContentDirective,
		])
	);

	beforeEach(() => {
		fixture = MockRender(ForgotPasswordComponent);
		dialogRef = ngMocks.get(DialogRef);

		closeButton = dataTest('close-button');
		emailInput = dataTest('email-input');
		sendEmailButton = dataTest('send-email-button');
	});

	it('closes the dialog', () => {
		// Act
		closeButton.nativeElement.click();
		// Assert
		expect(dialogRef.close).toHaveBeenCalledTimes(1);
		expect(dialogRef.close).toHaveBeenCalledWith(null);
	});

	it('does not submit when email empty, shows required error', () => {
		// Act
		sendEmailButton.nativeElement.click();
		// Arrange
		requiredError = dataTest('required-error');
		// Assert
		expect(dialogRef.close).not.toHaveBeenCalled();
		expect(requiredError.nativeElement.textContent).toContain(
			'Enter a your email'
		);
	});

	it('does not submit when email invalid, shows invalid email error', () => {
		// Act
		emailInput.nativeElement.value = 'howdy';
		emailInput.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		sendEmailButton.nativeElement.click();
		// Arrange
		validEmailError = dataTest('valid-email-error');
		// Assert
		expect(dialogRef.close).not.toHaveBeenCalled();
		expect(validEmailError.nativeElement.textContent).toContain(
			'Enter a valid email'
		);
	});

	it('closes dialog with submitted valid email', () => {
		// Arrange
		const mockEmail = 'kees@home.nl';
		// Act
		emailInput.nativeElement.value = mockEmail;
		emailInput.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		sendEmailButton.nativeElement.click();
		// Arrange
		const requiredError = dataTestIf('required-error');
		const validEmailError = dataTestIf('valid-email-error');
		// Assert
		expect(dialogRef.close).toHaveBeenCalledTimes(1);
		expect(dialogRef.close).toHaveBeenCalledWith(mockEmail);
		expect(requiredError).toBe(false);
		expect(validEmailError).toBe(false);
	});
});
