import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { dataTest } from '../../../../test/helpers/data-test.helper';
import { ResponsiveServiceMock } from '../../../base/services/responsive.service.mock';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { WelcomeComponent } from './welcome.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { Devices } from '../../../base/models/devices.model';

describe('SignInComponent', () => {
	let component: WelcomeComponent;
	let centerPageComponent: MockedDebugElement<CenterPageComponent>;
	let fixture: MockedComponentFixture<WelcomeComponent>;
	const mockResponsiveService: ResponsiveServiceMock =
		new ResponsiveServiceMock();

	beforeEach(() =>
		MockBuilder(WelcomeComponent, [
			ResponsiveService,
			CenterPageComponent,
		]).mock(ResponsiveService, mockResponsiveService)
	);

	describe('maxWidth', () => {
		beforeEach(() => {
			// Arrange
			fixture = MockRender(WelcomeComponent);
			component = fixture.point.componentInstance;
			centerPageComponent = ngMocks.find(CenterPageComponent);
		});

		it('should set default values', () => {
			// Arrange
			const title = dataTest('welcome-title');
			// Assert
			expect(component).toBeTruthy();
			expect(title.nativeElement.textContent).toBe('Simply');
			expect(centerPageComponent.componentInstance.maxContentWidth).toBe(
				'small'
			);
		});

		it('should set maxWith for widescreen device', () => {
			// Arrange
			mockResponsiveService.deviceSignal.set(Devices.WideScreen);
			fixture.detectChanges();
			// Assert
			expect(centerPageComponent.componentInstance.maxContentWidth).toBe(
				'regular'
			);
		});
	});
});
