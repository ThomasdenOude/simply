import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ConfirmPasswordComponent } from './confirm-password.component';
import { FormGroupDirective } from '@angular/forms';

describe('ConfirmPasswordComponent', () => {
	let component: ConfirmPasswordComponent;
	let fixture: MockedComponentFixture<ConfirmPasswordComponent>;

	beforeEach(() =>
		MockBuilder(ConfirmPasswordComponent).keep(FormGroupDirective)
	);

	it('should have NONE as passwordConfirmError', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		// Assert
		expect(component['passwordConfirmError']()).toBe('NONE');
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
		// Assert
		expect(component['passwordConfirmError']()).toBe('EMAIL_EXISTS');
	});

	it('should emit onClose event', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const spyClose = jest.spyOn(component.onErrorClose, 'emit');
		// Act
		component['closeError']();
		// Assert
		expect(spyClose).toHaveBeenCalledTimes(1);
	});

	it('should emit password when form is valid', () => {
		// Arrange
		fixture = MockRender(ConfirmPasswordComponent);
		component = fixture.point.componentInstance;
		const spyPasswordSubmit = jest.spyOn(component.onPasswordSubmit, 'emit');
		const form = component['form'];
		const spyReset = jest.spyOn(form!, 'resetForm');
		// Assert
		expect(component.passwordForm.valid).toBe(false);
		// Act
		component['submit']();
		// Assert
		expect(spyPasswordSubmit).not.toHaveBeenCalled();
		expect(spyReset).not.toHaveBeenCalled();
		// Act
		component.passwordForm.get('password')?.setValue('test-password');
		// Assert
		expect(component.passwordForm.valid).toBe(true);
		// Act
		component['submit']();
		// Assert
		expect(spyPasswordSubmit).toHaveBeenCalledTimes(1);
		expect(spyPasswordSubmit).toHaveBeenCalledWith('test-password');
		expect(spyReset).toHaveBeenCalledTimes(1);
	});
});
