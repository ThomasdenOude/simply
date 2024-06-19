import { computed, signal, WritableSignal } from '@angular/core';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { WelcomeComponent } from './welcome.component';
import { Devices } from '../../../base/models/devices';

describe('SignInComponent', () => {
	let component: WelcomeComponent;
	let fixture: MockedComponentFixture<WelcomeComponent>;
	const mockDevice: WritableSignal<Devices> = signal(Devices.Unknown);

	beforeEach(() =>
		MockBuilder(WelcomeComponent, ResponsiveService).mock(ResponsiveService, {
			device: computed(() => mockDevice()),
		})
	);

	describe('maxWidth', () => {
		beforeEach(() => {
			// Arrange
			fixture = MockRender(WelcomeComponent);
			component = fixture.point.componentInstance;
		});

		it('should set default values', () => {
			// Assert
			expect(component['device']()).toBe(Devices.Unknown);
			expect(component['maxWidth']()).toBe('small');
		});

		it('should set maxWith for widescreen device', () => {
			// Arrange
			mockDevice.set(Devices.WideScreen);
			// Assert
			expect(component['device']()).toBe(Devices.WideScreen);
			expect(component['maxWidth']()).toBe('regular');
		});
	});
});
