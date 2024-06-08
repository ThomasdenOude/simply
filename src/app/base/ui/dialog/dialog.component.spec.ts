import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { DialogConfig } from '@angular/cdk/dialog';
import { OverlayRef } from '@angular/cdk/overlay';

import { DialogComponent } from './dialog.component';

describe('DialogComponent', () => {
	let fixture: MockedComponentFixture<DialogComponent>;

	beforeEach(() => MockBuilder(DialogComponent, [OverlayRef, DialogConfig]));

	it('should create', () => {
		// Arrange
		fixture = MockRender(DialogComponent);
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(
			'class="cdk-dialog-container simply-dialog__host"'
		);
	});
});
