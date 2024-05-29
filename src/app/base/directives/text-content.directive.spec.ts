import { MockBuilder, MockRender } from 'ng-mocks';

import { TextContentDirective } from './text-content.directive';

describe('SimplyTextDirective', () => {
	const defaultClass = 'simply-text-content';
	const headlineClass = 'simply-text-headline';
	const subHeadlineClass = 'simply-text-sub-headline';
	const bodyClass = 'simply-text-body';

	beforeEach(() => MockBuilder(TextContentDirective));

	it('should set default class', () => {
		const directive = MockRender('<div simplyTextContent></div>');
		const rendered = directive.nativeElement.innerHTML;

		expect(rendered).toContain(`class="${defaultClass}"`);
	});

	describe('Headline text', () => {
		it('should set headline class for h1 element', () => {
			const directive = MockRender('<h1 simplyTextContent></h1>');
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class for h2 element', () => {
			const directive = MockRender('<h2 simplyTextContent></h2>');
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${headlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-1 class', () => {
			const directive = MockRender(
				'<div class="mat-headline-1" simplyTextContent></div>'
			);
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="mat-headline-1 ${headlineClass}`);
		});
	});

	describe('Sub headline text', () => {
		it('should set sub headline class for h3 element', () => {
			const directive = MockRender('<h3 simplyTextContent></h3>');
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set sub headline class for h4 element', () => {
			const directive = MockRender('<h4 simplyTextContent></h4>');
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="${subHeadlineClass}"`);
		});

		it('should set headline class when element has "mat-headline-2 class', () => {
			const directive = MockRender(
				'<div class="mat-headline-2" simplyTextContent></div>'
			);
			const rendered = directive.nativeElement.innerHTML;

			expect(rendered).toContain(`class="mat-headline-2 ${subHeadlineClass}`);
		});
	});

	it('should set body class for p element', () => {
		const directive = MockRender('<p simplyTextContent></p>');
		const rendered = directive.nativeElement.innerHTML;

		expect(rendered).toContain(`class="${bodyClass}"`);
	});
});
