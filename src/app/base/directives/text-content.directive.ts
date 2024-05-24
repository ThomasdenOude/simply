import {
	AfterContentInit,
	Directive,
	ElementRef,
	inject,
	Renderer2,
} from '@angular/core';

@Directive({
	selector: '[simplyTextContent]',
	standalone: true,
})
export class TextContentDirective implements AfterContentInit {
	private element: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);

	ngAfterContentInit() {
		const host = this.element.nativeElement;
		if (
			host.matches('h1') ||
			host.matches('h2') ||
			host.matches('.mat-headline-1')
		) {
			this.renderer.addClass(host, 'simply-text-headline');
		} else if (
			host.matches('h3') ||
			host.matches('h4') ||
			host.matches('.mat-headline-2')
		) {
			this.renderer.addClass(host, 'simply-text-sub-headline');
		} else if (host.matches('p')) {
			this.renderer.addClass(host, 'simply-text-body');
		} else {
			this.renderer.addClass(host, 'simply-text-content');
		}
	}
}
