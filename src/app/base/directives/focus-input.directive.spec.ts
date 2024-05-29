import { MatInput } from '@angular/material/input';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

import { FocusInputDirective } from './focus-input.directive';

describe('FocusInputDirective', () => {
	beforeEach(() => MockBuilder(FocusInputDirective, MatInput));
	it('should call focus method of matInput directive', () => {
		const fixture = MockRender('<input matInput simplyFocusInput/>');
		expect(fixture).toBeTruthy();

		const matInput = ngMocks.findInstance(MatInput);
		expect(matInput).toBeTruthy();
		expect(matInput.focus).toHaveBeenCalledTimes(1);
	});
});
