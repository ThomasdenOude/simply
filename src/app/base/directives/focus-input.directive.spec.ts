import { MatInput } from '@angular/material/input';
import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { FocusInputDirective } from './focus-input.directive';

describe('FocusInputDirective', () => {
	let fixture: MockedComponentFixture<FocusInputDirective>;
	let directive: FocusInputDirective;

	beforeEach(() => MockBuilder(FocusInputDirective, MatInput));

	it('should call focus method of matInput directive', () => {
		// Arrange
		fixture = MockRender<FocusInputDirective>(
			'<input matInput simplyFocusInput/>'
		);
		directive = fixture.point.componentInstance;
		const matInput = ngMocks.findInstance(MatInput);

		// Assert
		expect(directive).toBeTruthy();
		expect(matInput).toBeTruthy();
		expect(matInput.focus).toHaveBeenCalledTimes(1);
	});
});
