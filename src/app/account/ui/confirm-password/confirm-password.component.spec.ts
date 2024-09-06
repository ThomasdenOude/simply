import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
} from 'ng-mocks';

import { ConfirmPasswordComponent } from './confirm-password.component';
import { FormGroupDirective } from '@angular/forms';
import { MessageComponent } from '../../../base/ui/message/message.component';
import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';

describe('ConfirmPasswordComponent', () => {
	let component: ConfirmPasswordComponent;
	let fixture: MockedComponentFixture<ConfirmPasswordComponent>;

	beforeEach(() =>
		MockBuilder(ConfirmPasswordComponent, [
			MessageComponent,
			SpaceContentDirective,
		]).keep(FormGroupDirective)
	);

	it('should not show message if there is no password confirm error', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const message: MockedDebugElement<MessageComponent> | false = dataTestIf(
			'password-confirm-message'
		);
		// Assert

		expect(message).toBe(false);
	});

	it('should have EMAIL_EXISTS as passwordConfirmError', () => {
		// Arrange
		const params = {
			setPasswordConfirmError: 'EMAIL_EXISTS',
		};
		const fixture = MockRender<ConfirmPasswordComponent>(
			ConfirmPasswordComponent,
			params
		);
		component = fixture.point.componentInstance;
		const message: MockedDebugElement<MessageComponent> = dataTest(
			'password-confirm-message'
		);
		// Assert
		expect(message.componentInstance.errorMessage).toBe('EMAIL_EXISTS');
	});

	it('should emit onClose event', () => {
		// Arrange
		const params = {
			setPasswordConfirmError: 'EMAIL_EXISTS',
		};
		const fixture = MockRender<ConfirmPasswordComponent>(
			ConfirmPasswordComponent,
			params
		);
		component = fixture.point.componentInstance;
		const spyClose = jest.spyOn(component.closePasswordError, 'emit');
		const message: MockedDebugElement<MessageComponent> = dataTest(
			'password-confirm-message'
		);
		// Act
		message.componentInstance.onClose.emit();
		// Assert
		expect(spyClose).toHaveBeenCalledTimes(1);
	});

	it('should emit password when form is valid, and reset form values', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const spyPasswordSubmit = jest.spyOn(component.passwordSubmit, 'emit');
		const input = dataTest('confirm-password-input');
		const submit = dataTest('submit-button');
		// Act
		input.nativeElement.value = 'test-password';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		submit.nativeElement.click();
		// Assert
		expect(spyPasswordSubmit).toHaveBeenCalledTimes(1);
		expect(spyPasswordSubmit).toHaveBeenCalledWith('test-password');
		expect(input.nativeElement.value).toBe('');
	});

	it('should not emit password when form is invalid', () => {
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const spyPasswordSubmit = jest.spyOn(component.passwordSubmit, 'emit');
		const submit = dataTest('submit-button');
		// Act
		submit.nativeElement.click();
		expect(spyPasswordSubmit).not.toHaveBeenCalled();
		// Arrange
		const requiredError = dataTest('required-error');
		// Assert
		expect(requiredError).toBeTruthy();
		expect(requiredError.nativeElement.textContent).toBe(
			'Provide your current password to continue'
		);
	});
});
