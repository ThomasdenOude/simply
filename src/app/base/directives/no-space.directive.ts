import {
	AfterContentInit,
	Directive,
	ElementRef,
	inject,
	Renderer2,
} from '@angular/core';

@Directive({
	selector: '[simplyNoSpace]',
	standalone: true,
})
export class NoSpaceDirective implements AfterContentInit {
	private element: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);
	ngAfterContentInit() {
		this.renderer.addClass(this.element.nativeElement, 'simply-no-space');
	}
}
