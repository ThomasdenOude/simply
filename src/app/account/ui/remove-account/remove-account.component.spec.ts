import { DialogRef } from '@angular/cdk/dialog';
import {
	MockBuilder,
	MockedComponentFixture,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { RemoveAccountComponent } from './remove-account.component';
import { signal } from '@angular/core';
import { Devices } from '../../../base/models/devices.model';
import { By } from '@angular/platform-browser';

describe('RemoveAccountComponent', () => {
	let fixture: MockedComponentFixture<RemoveAccountComponent>;
	let dialogRef: DialogRef;

	beforeEach(() =>
		MockBuilder(RemoveAccountComponent, [ResponsiveService, DialogRef]).mock(
			ResponsiveService,
			{
				device: signal(Devices.Unknown),
			}
		)
	);

	describe('devices and close dialog', () => {
		beforeEach(() => {
			// Arrange
			fixture = MockRender(RemoveAccountComponent);
			dialogRef = ngMocks.get(DialogRef);
		});

		it('should close dialog on cancel with false', () => {
			// Arrange
			const cancelButton = fixture.debugElement.query(
				By.css('[data-test=cancel-button]')
			);
			// Assert
			expect(dialogRef.close).not.toHaveBeenCalled();
			// Act
			cancelButton.nativeElement.click();
			expect(dialogRef.close).toHaveBeenCalledTimes(1);
			expect(dialogRef.close).toHaveBeenCalledWith(false);
		});

		it('should close dialog on removeAccount with true', () => {
			// Arrange
			const removeAccountButton = fixture.debugElement.query(
				By.css('[data-test=remove-account-button]')
			);
			// Assert
			expect(dialogRef.close).not.toHaveBeenCalled();
			// Act
			removeAccountButton.nativeElement.click();
			// Assert
			expect(dialogRef.close).toHaveBeenCalledTimes(1);
			expect(dialogRef.close).toHaveBeenCalledWith(true);
		});
	});
});
