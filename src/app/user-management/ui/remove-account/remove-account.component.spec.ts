import { signal } from '@angular/core';

import { DialogRef } from '@angular/cdk/dialog';
import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { RemoveAccountComponent } from './remove-account.component';
import { Devices } from '../../../base/models/devices';

describe('RemoveAccountComponent', () => {
	let component: RemoveAccountComponent;
	let fixture: MockedComponentFixture<RemoveAccountComponent>;

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
			component = fixture.point.componentInstance;
		});

		it('should set the device', () => {
			// Assert
			expect(component['device']()).toBe(Devices.Unknown);
		});

		it('should close dialog on cancel with false', () => {
			// Arrange
			const spyClose = jest.spyOn(component['dialogRef'], 'close');
			// Assert
			expect(spyClose).not.toHaveBeenCalled();
			// Act
			component['cancel']();
			expect(spyClose).toHaveBeenCalledTimes(1);
			expect(spyClose).toHaveBeenCalledWith(false);
		});

		it('should close dialog on removeAccount with true', () => {
			// Arrange
			const spyClose = jest.spyOn(component['dialogRef'], 'close');
			// Assert
			expect(spyClose).not.toHaveBeenCalled();
			// Act
			component['removeAccount']();
			expect(spyClose).toHaveBeenCalledTimes(1);
			expect(spyClose).toHaveBeenCalledWith(true);
		});
	});
});
