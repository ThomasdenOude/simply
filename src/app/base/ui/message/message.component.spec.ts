import { FormControl, FormGroup } from '@angular/forms';

import { MockBuilder, MockRender } from 'ng-mocks';
import SpyInstance = jest.SpyInstance;

import { MessageComponent } from './message.component';

describe('MessageComponent', () => {
	let component: MessageComponent;

	const message = 'test error message';
	const testValue = 'test value';
	const form: FormGroup = new FormGroup({
		test: new FormControl(testValue),
	});

	beforeEach(() => MockBuilder(MessageComponent));

	it('should set errorMessage', () => {
		// Arrange
		const fixture = MockRender(MessageComponent, {
			errorMessage: message,
		});
		component = fixture.point.componentInstance;

		// Assert
		expect(component.errorMessage()).toBe(message);
	});

	describe('Close message', () => {
		it('should emit onClose when closeMessage is called', () => {
			// Arrange
			const fixture = MockRender(MessageComponent, {
				errorMessage: message,
			});
			component = fixture.point.componentInstance;

			const onCloseSpy: SpyInstance = jest.spyOn(component.onClose, 'emit');

			// Assert
			expect(onCloseSpy).not.toHaveBeenCalled();

			// Act
			component['closeMessage']();
			fixture.detectChanges();

			// Assert
			expect(onCloseSpy).toHaveBeenCalledTimes(1);
		});

		it('should emit onclose when form value changes', () => {
			// Arrange
			const fixture = MockRender(MessageComponent, {
				errorMessage: message,
				form: form,
			});
			component = fixture.point.componentInstance;

			const onCloseSpy: SpyInstance = jest.spyOn(component.onClose, 'emit');
			const formControl = component.form()?.get('test');

			// Assert
			expect(formControl?.value).toBe(testValue);
			expect(onCloseSpy).not.toHaveBeenCalled();

			// Act
			formControl?.setValue('new value');
			fixture.detectChanges();

			// Assert
			expect(formControl?.value).toBe('new value');
			expect(onCloseSpy).toHaveBeenCalledTimes(1);
		});

		it('should clean up form valueChanges subscription after destroy', () => {
			// Arrange
			const fixture = MockRender(MessageComponent, {
				errorMessage: message,
				form: form,
			});
			component = fixture.point.componentInstance;

			const onCloseSpy: SpyInstance = jest.spyOn(component.onClose, 'emit');
			const nextSpy: SpyInstance = jest.spyOn(component['destroy'], 'next');
			const completeSpy: SpyInstance = jest.spyOn(
				component['destroy'],
				'complete'
			);
			const formControl = component.form()?.get('test');

			// Assert
			expect(onCloseSpy).not.toHaveBeenCalled();

			// Act
			fixture.destroy();

			// Assert
			expect(nextSpy).toHaveBeenCalledTimes(1);
			expect(completeSpy).toHaveBeenCalledTimes(1);

			// Act
			formControl?.setValue('new value');
			fixture.detectChanges();

			// Assert
			expect(formControl?.value).toBe('new value');
			expect(onCloseSpy).not.toHaveBeenCalled();
		});
	});
});
