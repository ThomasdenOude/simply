import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
	beforeEach(() => MockBuilder(AppComponent));

	it('should create the app', () => {
		const fixture: MockedComponentFixture<AppComponent> =
			MockRender(AppComponent);
		const app: AppComponent = fixture.point.componentInstance;
		expect(app).toBeTruthy();
	});
});
