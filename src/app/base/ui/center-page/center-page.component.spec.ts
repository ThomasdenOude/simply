import { signal } from '@angular/core';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ResponsiveService } from '../../services/responsive.service';
import { CenterPageComponent } from './center-page.component';
import { Devices } from '../../models/devices';
import { BaseSizes } from '../../models/style-sizes';

describe('CenterPageComponent', () => {
	let fixture: MockedComponentFixture<CenterPageComponent>;
	let component: CenterPageComponent;
	let size: BaseSizes;

	beforeEach(() =>
		MockBuilder(CenterPageComponent, ResponsiveService).mock(
			ResponsiveService,
			{
				device: signal(Devices.WideScreen),
			}
		)
	);

	it('should receive device from device service', () => {
		// Arrange
		fixture = MockRender(CenterPageComponent);
		component = fixture.point.componentInstance;
		// Assert
		expect(component).toBeTruthy();
		expect(component['device']()).toBe(Devices.WideScreen);
	});

	describe('maxContentWidth', () => {
		it('should set default maxContentWidth to regular', () => {
			// Arrange
			size = 'regular';
			fixture = MockRender('<simply-center-page></simply-center-page>');
			component = fixture.point.componentInstance;
			// Assert
			expect(component.maxContentWidth()).toBe(size);
		});

		it('should set maxContentWidth to large', () => {
			// Arrange
			size = 'large';
			fixture = MockRender(
				`<simply-center-page maxContentWidth="${size}"></simply-center-page>`
			);
			component = fixture.point.componentInstance;
			// Assert
			expect(component.maxContentWidth()).toBe(size);
		});
	});
});
