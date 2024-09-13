import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
} from 'ng-mocks';

import { dataTest } from '../../../../test/helpers/data-test.helper';
import { inputTest } from '../../../../test/helpers/input-test.helper';
import { NewPasswordComponent } from './new-password.component';

describe('NewPasswordFormFieldComponent', () => {
	let component: NewPasswordComponent;
	let fixture: MockedComponentFixture<NewPasswordComponent>;
	let newPasswordInput: MockedDebugElement;
	let newPasswordRequiredError: MockedDebugElement | false;
	let newPasswordLengthError: MockedDebugElement | false;
	let repeatPasswordInput: MockedDebugElement;
	let repeatPasswordRequiredError: MockedDebugElement | false;
	let repeatPasswordSameError: MockedDebugElement | false;
	let submitButton: MockedDebugElement;
	let newPassword: string | undefined;

	beforeEach(() => MockBuilder(NewPasswordComponent));

	it('should set default values if no input provided', () => {
		// Arrange
		fixture = MockRender('<simply-new-password></simply-new-password>');
		component = fixture.point.componentInstance;
		// Assert
		expect(component.newPasswordTitle()).toBe('Make a new password');
		expect(component.newPasswordSubmitText()).toBe('Save');
	});

	it('should set the title and submitAction', () => {
		// Arrange
		const params = {
			newPasswordTitle: 'test title',
			newPasswordSubmitText: 'test action',
		};
		const fixture = MockRender(NewPasswordComponent, params);
		component = fixture.point.componentInstance;
		// Assert
		expect(component.newPasswordTitle()).toBe('test title');
		expect(component.newPasswordSubmitText()).toBe('test action');
	});

	describe('Submit form', () => {
		beforeEach(() => {
			// Arrange
			fixture = MockRender(NewPasswordComponent);
			component = fixture.point.componentInstance;
			newPasswordInput = dataTest('new-password-input');
			repeatPasswordInput = dataTest('repeat-password-input');
			submitButton = dataTest('submit-button');
			component.newPassword.subscribe(value => (newPassword = value));
		});

		it('does not emit newPassword when form is empty', () => {
			// Arrange
			// Act
			submitButton.nativeElement.click();
			// Arrange
			newPasswordRequiredError = dataTest('new-password-required-error');
			repeatPasswordRequiredError = dataTest('repeat-password-required-error');
			// Assert
			expect(newPassword).toBeUndefined();
			expect(newPasswordRequiredError.nativeElement.textContent).toContain(
				'Enter in a new password'
			);
			expect(repeatPasswordRequiredError.nativeElement.textContent).toContain(
				'Repeat the same password'
			);
		});

		it('does not emit newPassword when newPassword too short or passwords not the same', () => {
			// Act
			inputTest(newPasswordInput, 'short');
			inputTest(repeatPasswordInput, 'long');
			fixture.detectChanges();
			submitButton.nativeElement.click();
			// Arrange
			newPasswordLengthError = dataTest('new-password-length-error');
			repeatPasswordSameError = dataTest('repeat-password-same-error');
			// Assert
			expect(newPassword).toBeUndefined();
			expect(newPasswordLengthError.nativeElement.textContent).toContain(
				'Password should be at least 8 characters long'
			);
			expect(repeatPasswordSameError.nativeElement.textContent).toContain(
				'Passwords are not the same'
			);
		});

		it('emits new password and resets form', () => {
			// Arrange
			const mockPassword = 'super-secret';
			// Act
			inputTest(newPasswordInput, mockPassword);
			inputTest(repeatPasswordInput, mockPassword);
			fixture.detectChanges();
			submitButton.nativeElement.click();
			// Assert
			expect(newPassword).toBe(mockPassword);
			// Arrange
			newPasswordInput = dataTest('new-password-input');
			repeatPasswordInput = dataTest('repeat-password-input');
			// Assert
			expect(newPasswordInput.nativeElement.value).toBe('');
			expect(repeatPasswordInput.nativeElement.value).toBe('');
		});
	});
});
