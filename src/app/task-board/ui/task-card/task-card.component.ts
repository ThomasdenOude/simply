import {
	Component,
	EventEmitter,
	InputSignal,
	Output,
	input,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	inject,
	Renderer2,
} from '@angular/core';

import {
	filter,
	fromEvent,
	map,
	Observable,
	Subject,
	switchMap,
	takeUntil,
	timer,
	withLatestFrom,
} from 'rxjs';
import { MatCardModule } from '@angular/material/card';

import { Task } from '../../models/task.model';
import { NoSpaceDirective } from '../../../base/directives/no-space.directive';

@Component({
	selector: 'simply-task-card',
	standalone: true,
	imports: [MatCardModule, NoSpaceDirective],
	templateUrl: './task-card.component.html',
	styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements AfterViewInit, OnDestroy {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);

	private destroy: Subject<void> = new Subject<void>();

	public task: InputSignal<Task> = input.required<Task>();

	@Output()
	public editTask: EventEmitter<Task> = new EventEmitter<Task>();

	ngAfterViewInit() {
		const taskCard = this.elementRef.nativeElement;
		this.renderer.addClass(taskCard, 'task-card__element');
		this.renderer.addClass(taskCard, 'task-card__host');
		const touchEnd$: Observable<unknown> = fromEvent(taskCard, 'touchend').pipe(
			takeUntil(timer(300))
		);
		fromEvent(taskCard, 'touchstart')
			.pipe(
				takeUntil(this.destroy),
				withLatestFrom(touchEnd$),
				map(([start, end]) => {
					const startY = (start as TouchEvent).changedTouches[0].clientY;
					const endY = (end as TouchEvent).changedTouches[0].clientY;

					return Math.abs(startY - endY);
				}),
				filter(distance => distance < 30)
			)
			.subscribe(() => this.emitEditTask());

		const mouseDown$: Observable<unknown> = fromEvent(taskCard, 'mouseup').pipe(
			takeUntil(timer(300))
		);
		fromEvent(taskCard, 'mousedown')
			.pipe(
				takeUntil(this.destroy),
				switchMap(() => mouseDown$)
			)
			.subscribe(() => this.emitEditTask());
	}

	protected emitEditTask(): void {
		this.editTask.emit(this.task());
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
