import {
	AfterContentChecked,
	AfterContentInit,
	Directive,
	effect,
	ElementRef,
	HostListener,
	inject,
	input,
	InputSignal,
	Renderer2,
	signal,
	WritableSignal,
} from '@angular/core';
import { TaskStatus } from '../models/task.model';
import { MatIconModule } from '@angular/material/icon';
import { Element } from '@angular/compiler';

@Directive({
	selector: 'button[appTaskBoardTab]',
	standalone: true,
	providers: [MatIconModule],
})
export class TaskBoardTabDirective {
	private elementRef: ElementRef = inject(ElementRef);
	private readonly host: Element;
	private renderer: Renderer2 = inject(Renderer2);

	public active: InputSignal<boolean> = input.required<boolean>();
	public taskStatus: InputSignal<TaskStatus> = input.required<TaskStatus>();

	@HostListener('mouseover')
	private mouseOver() {
		this.addActive();
	}
	@HostListener('mouseleave')
	private mouseLeave() {
		this.removeActive();
	}

	constructor() {
		this.host = this.elementRef.nativeElement;
		this.renderer.addClass(this.host, 'task-board-group__tab');

		effect(() => {
			if (this.active()) {
				this.addActive();
				this.renderer.setAttribute(
					this.host,
					'aria-current',
					this.taskStatus()
				);
			} else {
				this.removeActive();
				this.renderer.removeAttribute(
					this.host,
					'aria-current',
					this.taskStatus()
				);
			}
		});
	}

	private addActive(): void {
		this.renderer.addClass(this.host, 'active-tab');
	}

	private removeActive(): void {
		if (!this.active()) {
			this.renderer.removeClass(this.host, 'active-tab');
		}
	}
}
