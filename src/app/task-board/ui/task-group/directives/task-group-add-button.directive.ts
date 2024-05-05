import { Directive, ElementRef, inject, Renderer2 } from '@angular/core';

@Directive({
	selector: '[simplyTaskGroupAddButton]',
	standalone: true,
})
export class TaskGroupAddButtonDirective {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);
	constructor() {
		this.renderer.addClass(
			this.elementRef.nativeElement,
			'simply-task-group__add-button'
		);
	}
}
