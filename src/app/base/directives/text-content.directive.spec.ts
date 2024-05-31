import { MockBuilder, MockRender } from 'ng-mocks';

import { TextContentDirective } from './text-content.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('SimplyTextDirective', () => {
	const defaultClass = 'simply-text-content';
	const headlineClass = 'simply-text-headline';
	const subHeadlineClass = 'simply-text-sub-headline';
	const bodyClass = 'simply-text-body';

	beforeEach(() => MockBuilder(TextContentDirective, [ElementRef, Renderer2]));

	it('should set default class', () => {
		const fixture = MockRender('<div simplyTextContent></div>');
		const rendered = fixture.nativeElement.innerHTML;

		expect(rendered).toContain(`class="${defaultClass}"`);
	});

	describe('Headline text', () => {
		it('should set headline class for h1 element', () => {
			const fixture = MockRender('<h1 simplyTextContent></h1>');
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class for h2 element', () => {
			const fixture = MockRender('<h2 simplyTextContent></h2>');
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-1 class', () => {
			const fixture = MockRender(
				'<div class="mat-headline-1" simplyTextContent></div>'
			);
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="mat-headline-1 ${headlineClass}`);
		});
	});

	describe('Sub headline text', () => {
		it('should set sub headline class for h3 element', () => {
			const fixture = MockRender('<h3 simplyTextContent></h3>');
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set sub headline class for h4 element', () => {
			const fixture = MockRender('<h4 simplyTextContent></h4>');
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-2 class', () => {
			const fixture = MockRender(
				'<div class="mat-headline-2" simplyTextContent></div>'
			);
			const rendered = fixture.nativeElement.innerHTML;

			expect(rendered).toContain(`class="mat-headline-2 ${subHeadlineClass}`);
		});
	});

	it('should set body class for p element', () => {
		const fixture = MockRender('<p simplyTextContent></p>');
		const rendered = fixture.nativeElement.innerHTML;

		expect(rendered).toContain(`class="${bodyClass}"`);
	});
});
