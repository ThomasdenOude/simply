import { fakeAsync, tick } from '@angular/core/testing';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
	let fixture: MockedComponentFixture<NavigationService>;
	let service: NavigationService;
	const originalHidden = document.hidden;

	afterAll(() => {
		Object.defineProperty(document, 'hidden', {
			writable: false,
			value: originalHidden,
		});
	});

	beforeEach(() => MockBuilder(NavigationService));

	beforeEach(() => {
		fixture = MockRender(NavigationService);
		service = fixture.point.componentInstance;
	});

	it('should not return if no visibility changes', fakeAsync(() => {
		// Arrange
		let result;
		const subscription = service.browserTabReturned$.subscribe(returned => {
			result = returned;
		});
		tick();
		// Assert
		expect(result).toBe(undefined);
		subscription.unsubscribe();
	}));

	it('Does not return after visibility change, if document is hidden', fakeAsync(() => {
		// Arrange
		let result;
		const subscription = service.browserTabReturned$.subscribe(returned => {
			result = returned;
		});
		Object.defineProperty(document, 'hidden', {
			writable: true,
			value: true,
		});
		// Act
		document.dispatchEvent(new Event('visibilitychange'));
		tick();
		// Assert
		expect(result).toBeUndefined();
		subscription.unsubscribe();
	}));

	it('Returns null after visibility change, if document is visible', fakeAsync(() => {
		// Arrange
		let result;
		const subscription = service.browserTabReturned$.subscribe(returned => {
			result = returned;
		});
		Object.defineProperty(document, 'hidden', {
			writable: true,
			value: false,
		});
		// Act
		document.dispatchEvent(new Event('visibilitychange'));
		tick();
		// Assert
		expect(result).toBe(null);
		subscription.unsubscribe();
	}));
});
