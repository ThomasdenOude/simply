import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { VisibilityChangesService } from './visibility-changes.service';

describe('VisibilityChangesService', () => {
	let fixture: MockedComponentFixture<VisibilityChangesService>;
	let service: VisibilityChangesService;
	const originalHidden = document.hidden;

	afterAll(() => {
		Object.defineProperty(document, 'hidden', {
			writable: false,
			value: originalHidden,
		});
	});

	beforeEach(() => MockBuilder(VisibilityChangesService));

	beforeEach(() => {
		fixture = MockRender(VisibilityChangesService);
		service = fixture.point.componentInstance;
	});

	it('browserTabReturned is undefined if no visibility changes', () => {
		// Assert
		expect(service.browserTabReturned()).toBe(undefined);
	});

	it('browserTabReturned is false after visibility change, if document is hidden', () => {
		// Arrange
		Object.defineProperty(document, 'hidden', {
			writable: true,
			value: true,
		});
		// Act
		document.dispatchEvent(new Event('visibilitychange'));
		// Assert
		expect(service.browserTabReturned()).toBe(false);
	});

	it('browserTabReturned is true after visibility change, if document is visible', () => {
		// Arrange
		Object.defineProperty(document, 'hidden', {
			writable: true,
			value: false,
		});
		// Act
		document.dispatchEvent(new Event('visibilitychange'));
		// Assert
		expect(service.browserTabReturned()).toBe(true);
	});
});
