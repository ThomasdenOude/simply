import { DialogConfig } from '@angular/cdk/dialog';
import { OverlayRef } from '@angular/cdk/overlay';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
	let fixture: MockedComponentFixture<DialogComponent>;

	beforeEach(() => MockBuilder(DialogComponent, [OverlayRef, DialogConfig]));

	it('should create', () => {
		// Arrange
		fixture = MockRender(DialogComponent);
		const classes = fixture.point.classes;
		// Assert
		expect(classes['cdk-dialog-container']).toBe(true);
		expect(classes['simply-dialog__host']).toBe(true);
	});
});
