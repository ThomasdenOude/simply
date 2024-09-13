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
		let closeEmit = false;
		component.closePasswordError.subscribe(() => (closeEmit = true));
		const message: MockedDebugElement<MessageComponent> = dataTest(
			'password-confirm-message'
		);
		// Act
		message.componentInstance.onClose.emit();
		// Assert
		expect(closeEmit).toBe(true);
	});

	it('should emit password when form is valid, and reset form values', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const input = dataTest('confirm-password-input');
		const submit = dataTest('submit-button');
		let password: string | undefined;
		component.passwordSubmit.subscribe(value => (password = value));
		// Act
		input.nativeElement.value = 'test-password';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		submit.nativeElement.click();
		// Assert
		expect(password).toBe('test-password');
		expect(input.nativeElement.value).toBe('');
	});

	it('should not emit password when form is invalid', () => {
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const submit = dataTest('submit-button');
		let password: string | undefined;
		component.passwordSubmit.subscribe(value => (password = value));
		// Act
		submit.nativeElement.click();
		expect(password).toBeUndefined();
		// Arrange
		const requiredError = dataTest('required-error');
		// Assert
		expect(requiredError).toBeTruthy();
		expect(requiredError.nativeElement.textContent).toBe(
			'Provide your current password to continue'
		);
	});
});
