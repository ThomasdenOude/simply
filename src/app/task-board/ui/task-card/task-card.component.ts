import {
	Component,
	EventEmitter,
	InputSignal,
	Output,
	input,
	ViewChild,
	ElementRef,
	AfterViewInit,
	OnDestroy,
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

@Component({
	selector: 'simply-task-card',
	standalone: true,
	imports: [MatCardModule],
	templateUrl: './task-card.component.html',
	styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements AfterViewInit, OnDestroy {
	private destroy: Subject<void> = new Subject<void>();
	public task: InputSignal<Task> = input.required<Task>();

	@ViewChild('taskCard', { read: ElementRef })
	private taskCard!: ElementRef;

	@Output()
	public editTask: EventEmitter<Task> = new EventEmitter<Task>();

	ngAfterViewInit() {
		const card = this.taskCard.nativeElement;
		const touchEnd$: Observable<unknown> = fromEvent(card, 'touchend').pipe(
			takeUntil(timer(300))
		);
		fromEvent(card, 'touchstart')
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

		const mouseDown$: Observable<unknown> = fromEvent(card, 'mouseup').pipe(
			takeUntil(timer(300))
		);
		fromEvent(card, 'mousedown')
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
