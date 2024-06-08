import {
	AfterContentInit,
	Directive,
	ElementRef,
	inject,
	input,
	InputSignal,
	Renderer2,
} from '@angular/core';

import { BaseSizes } from '../models/style-sizes';

@Directive({
	selector: '[simplySpaceContent]',
	standalone: true,
})
export class SpaceContentDirective implements AfterContentInit {
	private element: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);

	public simplySpaceContent: InputSignal<BaseSizes> =
		input<BaseSizes>('regular');
	ngAfterContentInit() {
		const host = this.element.nativeElement;
		this.renderer.addClass(host, 'simply-space-content__width');
		switch (this.simplySpaceContent()) {
			case 'small':
				this.renderer.addClass(host, 'simply-space-content__small');
				break;
			case 'regular':
				this.renderer.addClass(host, 'simply-space-content__regular');
				break;
			case 'large':
				this.renderer.addClass(host, 'simply-space-content__large');
				break;
			default:
				this.renderer.addClass(host, 'simply-space-content__regular');
				break;
		}
	}
}
