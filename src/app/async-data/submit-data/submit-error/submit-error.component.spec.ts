import { FormControl, FormGroup } from '@angular/forms';

import {
	DefaultRenderComponent,
	MockBuilder,
	MockedComponentFixture,
	MockRender,
} from 'ng-mocks';
import SpyInstance = jest.SpyInstance;

import { SubmitErrorComponent } from './submit-error.component';
import { dataTest } from '../../../test/helpers/data-test.helper';

describe('MessageComponent', () => {
	let fixture: MockedComponentFixture<
		SubmitErrorComponent,
		DefaultRenderComponent<Partial<SubmitErrorComponent>>
	>;
	let component: SubmitErrorComponent;

	const message = 'test error submit-error';
	const testValue = 'test value';
	const form: FormGroup = new FormGroup({
		test: new FormControl(testValue),
	});

	beforeEach(() => MockBuilder(SubmitErrorComponent));

	it('should set errorMessage', () => {
		// Arrange
		fixture = MockRender<SubmitErrorComponent>(SubmitErrorComponent, {
			errorMessage: message,
		});
		fixture.detectChanges();
		const messageText = dataTest('submit-error-text');
		// Assert
		expect(messageText.nativeElement.textContent).toBe(message);
	});

	describe('Close submit-error', () => {
		it('should emit onClose when closeMessage is called', () => {
			// Arrange
			fixture = MockRender<SubmitErrorComponent>(SubmitErrorComponent, {
				errorMessage: message,
			});
			component = fixture.point.componentInstance;
			let closeMessage = false;
			component.closeMessage.subscribe(value => {
				closeMessage = true;
			});
			const closeButton = dataTest('close-button');
			// Assert
			expect(closeMessage).toBe(false);
			// Act
			closeButton.nativeElement.click();
			fixture.detectChanges();
			// Assert
			expect(closeMessage).toBe(true);
		});

		it('should emit onclose when form value changes', () => {
			// Arrange
			fixture = MockRender<SubmitErrorComponent>(SubmitErrorComponent, {
				errorMessage: message,
				form: form,
			});
			component = fixture.point.componentInstance;
			let closeMessage = false;
			component.closeMessage.subscribe(value => {
				closeMessage = true;
			});
			const formControl = component.form()?.get('test');
			// Assert
			expect(formControl?.value).toBe(testValue);
			expect(closeMessage).toBe(false);
			// Act
			formControl?.setValue('new value');
			fixture.detectChanges();
			// Assert
			expect(formControl?.value).toBe('new value');
			expect(closeMessage).toBe(true);
		});

		it('should clean up form valueChanges subscription after destroy', () => {
			// Arrange
			fixture = MockRender<SubmitErrorComponent>(SubmitErrorComponent, {
				errorMessage: message,
				form: form,
			});
			component = fixture.point.componentInstance;
			let closeMessage = false;
			component.closeMessage.subscribe(value => {
				closeMessage = true;
			});
			const formControl = component.form()?.get('test');
			// Assert
			expect(closeMessage).toBe(false);
			// Act
			fixture.destroy();
			// Act
			formControl?.setValue('new value');
			fixture.detectChanges();
			// Assert
			expect(formControl?.value).toBe('new value');
			expect(closeMessage).toBe(false);
		});
	});
});
