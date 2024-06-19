import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { NewPasswordComponent } from './new-password.component';

describe('NewPasswordFormFieldComponent', () => {
	let component: NewPasswordComponent;
	let fixture: MockedComponentFixture<NewPasswordComponent>;

	beforeEach(() => MockBuilder(NewPasswordComponent));

	it('should set default values if no input provided', () => {
		// Arrange
		fixture = MockRender('<simply-new-password></simply-new-password>');
		component = fixture.point.componentInstance;
		// Assert
		expect(component.newPasswordTitle()).toBe('Make a new password');
		expect(component.newPasswordSubmitAction()).toBe('Save');
	});

	it('should set the title and submitAction', () => {
		// Arrange
		const params = {
			newPasswordTitle: 'test title',
			newPasswordSubmitAction: 'test action',
		};
		const fixture = MockRender(NewPasswordComponent, params);
		component = fixture.point.componentInstance;
		// Assert
		expect(component.newPasswordTitle()).toBe('test title');
		expect(component.newPasswordSubmitAction()).toBe('test action');
	});

	it('should emit newPassword when form is valid', () => {
		// Arrange
		fixture = MockRender(NewPasswordComponent);
		component = fixture.point.componentInstance;
		const spySubmitted = jest.spyOn(component.isSubmitted, 'emit');
		const form = component['form'];
		const spyReset = jest.spyOn(form!, 'resetForm');
		// Assert
		expect(component['newPasswordForm'].valid).toBe(false);
		// Act
		component['submitPassword']();
		// Assert
		expect(spySubmitted).not.toHaveBeenCalled();
		expect(spyReset).not.toHaveBeenCalled();
		// Act
		component['newPasswordForm'].patchValue({
			newPassword: 'youNeverGuess',
			repeatPassword: 'youNeverGuess',
		});
		// Assert
		expect(component['newPasswordForm'].valid).toBe(true);
		// Act
		component['submitPassword']();
		// Assert
		expect(spySubmitted).toHaveBeenCalledTimes(1);
		expect(spySubmitted).toHaveBeenCalledWith('youNeverGuess');
		expect(spyReset).toHaveBeenCalledTimes(1);
		expect(component['form']?.submitted).toBeFalsy();
	});
});
