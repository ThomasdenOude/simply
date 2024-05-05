import {
	Directive,
	effect,
	ElementRef,
	inject,
	input,
	InputSignal,
	Renderer2,
} from '@angular/core';
import { TaskStatus } from '../../../models/task.model';

@Directive({
	selector: '[simplyTaskGroupList]',
	standalone: true,
})
export class TaskGroupListDirective {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);
	private readonly host: Element;

	public active: InputSignal<boolean> = input.required<boolean>();
	public taskStatus: InputSignal<TaskStatus> = input.required<TaskStatus>();

	constructor() {
		this.host = this.elementRef.nativeElement;
		this.renderer.addClass(this.host, 'simply-task-group__list');

		effect(() => {
			if (!this.active()) {
				this.renderer.addClass(this.host, 'simply-task-group__list-hidden');
			} else {
				this.renderer.removeClass(this.host, 'simply-task-group__list-hidden');
			}
		});
	}
}
