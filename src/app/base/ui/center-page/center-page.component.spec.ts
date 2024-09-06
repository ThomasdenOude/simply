import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { ResponsiveService } from '../../services/responsive.service';
import { CenterPageComponent } from './center-page.component';
import { Devices } from '../../models/devices';
import { BaseSizes } from '../../models/style-sizes';
import { ResponsiveServiceMock } from '../../services/responsive.service.mock';
import { dataTest } from '../../../../test/helpers/data-test.helper';

describe('CenterPageComponent', () => {
	let fixture: MockedComponentFixture<CenterPageComponent>;
	let component: CenterPageComponent;
	const mockResponsiveService: ResponsiveServiceMock =
		new ResponsiveServiceMock();

	beforeEach(() =>
		MockBuilder(CenterPageComponent, ResponsiveService).mock(
			ResponsiveService,
			mockResponsiveService
		)
	);

	it('sets base class for container', () => {
		// Arrange
		fixture = MockRender(CenterPageComponent);
		component = fixture.point.componentInstance;
		const container = dataTest('center-page-container');
		// Assert
		expect(component).toBeTruthy();
		expect(container.classes['center-page__container']).toBe(true);
		expect(container.classes['center-page__phone-landscape']).toBe(undefined);
	});

	it('adds class for handset landscape', () => {
		// Act
		fixture = MockRender(CenterPageComponent);
		mockResponsiveService.deviceSignal.set(Devices.HandsetLandscape);
		fixture.detectChanges();
		// Arrange
		const container = dataTest('center-page-container');
		// Assert
		expect(component).toBeTruthy();
		expect(container.classes['center-page__container']).toBe(true);
		expect(container.classes['center-page__phone-landscape']).toBe(true);
	});

	it('should set default maxContentWidth to regular', () => {
		// Arrange
		fixture = MockRender('<simply-center-page></simply-center-page>');
		const content = dataTest('center-page-content');
		// Assert
		expect(content.classes['center-page__content']).toBe(true);
		expect(content.classes['center-page__regular']).toBe(true);
	});

	it('should set maxContentWidth to large', () => {
		// Arrange
		const size: BaseSizes = 'large';
		fixture = MockRender(
			`<simply-center-page maxContentWidth="${size}"></simply-center-page>`
		);
		const content = dataTest('center-page-content');
		// Assert
		expect(content.classes['center-page__large']).toBe(true);
	});
});
