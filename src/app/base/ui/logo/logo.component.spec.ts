import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
	let component: LogoComponent;
	let fixture: MockedComponentFixture<LogoComponent>;

	beforeEach(() => MockBuilder(LogoComponent));

	it('should create', () => {
		fixture = MockRender(LogoComponent);
		component = fixture.point.componentInstance;

		expect(component).toBeTruthy();
	});
});
