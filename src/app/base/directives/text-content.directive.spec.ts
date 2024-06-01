import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { TextContentDirective } from './text-content.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('SimplyTextDirective', () => {
	let fixture: MockedComponentFixture<TextContentDirective>;

	const defaultClass = 'simply-text-content';
	const headlineClass = 'simply-text-headline';
	const subHeadlineClass = 'simply-text-sub-headline';
	const bodyClass = 'simply-text-body';

	beforeEach(() => MockBuilder(TextContentDirective, [ElementRef, Renderer2]));

	it('should set default class', () => {
		// Arrange
		fixture = MockRender<TextContentDirective>('<div simplyTextContent></div>');
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${defaultClass}"`);
	});

	describe('Headline text', () => {
		it('should set headline class for h1 element', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>('<h1 simplyTextContent></h1>');
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class for h2 element', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>('<h2 simplyTextContent></h2>');
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-1 class', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>(
				'<div class="mat-headline-1" simplyTextContent></div>'
			);
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="mat-headline-1 ${headlineClass}`);
		});
	});

	describe('Sub headline text', () => {
		it('should set sub headline class for h3 element', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>('<h3 simplyTextContent></h3>');
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set sub headline class for h4 element', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>('<h4 simplyTextContent></h4>');
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-2 class', () => {
			// Arrange
			fixture = MockRender<TextContentDirective>(
				'<div class="mat-headline-2" simplyTextContent></div>'
			);
			const innerHTML = fixture.nativeElement.innerHTML;
			// Assert
			expect(innerHTML).toContain(`class="mat-headline-2 ${subHeadlineClass}`);
		});
	});

	it('should set body class for p element', () => {
		// Arrange
		fixture = MockRender<TextContentDirective>('<p simplyTextContent></p>');
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${bodyClass}"`);
	});
});
