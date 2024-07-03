import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { dataTest } from './base/test-helpers/data-test.helper';

describe('AppComponent', () => {
	beforeEach(() => MockBuilder(AppComponent, HeaderComponent));

	it('should create the app and show the header', () => {
		// Arrange
		const fixture: MockedComponentFixture<AppComponent> =
			MockRender(AppComponent);
		const app: AppComponent = fixture.point.componentInstance;
		const header = dataTest('simply-header');

		expect(app).toBeTruthy();
		expect(header).toBeTruthy();
	});
});
