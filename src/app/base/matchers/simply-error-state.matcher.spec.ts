import { FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { SimplyErrorStateMatcher } from './simply-error-state.matcher';
import { MockService } from 'ng-mocks';

describe('Error state matcher', () => {
	let control: FormControl<string | null>;
	let formGroupDirective: FormGroupDirective;
	let matcher: SimplyErrorStateMatcher;
	let isErrorState: boolean;

	beforeEach(() => {
		matcher = new SimplyErrorStateMatcher();
		control = new FormControl<string | null>('', [Validators.required]);
	});

	describe('Form not submitted', () => {
		beforeEach(() => {
			formGroupDirective = MockService<FormGroupDirective>(FormGroupDirective, {
				submitted: false,
			});
		});

		it('should return no errorState when control is invalid', () => {
			// Act
			isErrorState = matcher.isErrorState(control, formGroupDirective);
			// Assert
			expect(control.invalid).toBe(true);
			expect(formGroupDirective.submitted).toBe(false);
			expect(isErrorState).toBe(false);
		});

		it('should return no errorStatue when control is valid', () => {
			// Act
			control.setValue('test');
			isErrorState = matcher.isErrorState(control, formGroupDirective);
			// Assert
			expect(control.valid).toBe(true);
			expect(isErrorState).toBe(false);
		});
	});

	describe('Form not submitted', () => {
		beforeEach(() => {
			formGroupDirective = MockService<FormGroupDirective>(FormGroupDirective, {
				submitted: true,
			});
		});

		it('should return no errorState when no control provided', () => {
			// Act
			isErrorState = matcher.isErrorState(null, formGroupDirective);
			// Assert
			expect(formGroupDirective.submitted).toBe(true);
			expect(isErrorState).toBe(false);
		});

		it('should return no errorState when control is valid', () => {
			// Act
			control.setValue('test');
			isErrorState = matcher.isErrorState(control, formGroupDirective);
			// Assert
			expect(control.valid).toBe(true);
			expect(isErrorState).toBe(false);
		});

		it('should return errorState when control is invalid', () => {
			// Act
			isErrorState = matcher.isErrorState(control, formGroupDirective);
			// Assert
			expect(control.invalid).toBe(true);
			expect(isErrorState).toBe(true);
		});
	});
});
