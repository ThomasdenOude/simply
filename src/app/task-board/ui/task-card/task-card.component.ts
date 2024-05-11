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
	combineLatestWith,
	delay,
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	of,
	startWith,
	Subject,
	switchMap,
	takeUntil,
	tap,
	timer,
	zip,
} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { EventResponse } from '../../models/event-response';
import { Task } from '../../models/task.model';

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
	private ckgDrag: CdkDrag = inject(CdkDrag);

	private destroy: Subject<void> = new Subject<void>();

	public task: InputSignal<Task> = input.required<Task>();

	@Output()
	public editTask: EventEmitter<Task> = new EventEmitter<Task>();

	ngAfterViewInit() {
		const taskCard = this.elementRef.nativeElement;
		this.renderer.addClass(taskCard, 'task-card__element');
		this.renderer.addClass(taskCard, 'task-card__host');

		const { longHold$, released$, shortPress$ } = this.initEvents(
			taskCard,
			this.ckgDrag
		);

		longHold$
			.pipe(
				takeUntil(this.destroy),
				tap(() => this.renderer.addClass(taskCard, 'task-card__active')),
				switchMap(() => released$),
				tap(() => this.renderer.removeClass(taskCard, 'task-card__active'))
			)
			.subscribe();

		shortPress$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.emitEditTask());
	}

	protected emitEditTask(): void {
		this.editTask.emit(this.task());
	}

	private initEvents(taskCard: any, cdkDrag: CdkDrag) {
		// Mouse events
		const mouseDown$: Observable<MouseEvent> = fromEvent(taskCard, 'mousedown');
		const mouseUp$: Observable<MouseEvent> = fromEvent(taskCard, 'mouseup');
		const mouseMove$: Observable<MouseEvent> = fromEvent(taskCard, 'mousemove');
		const mouseLeave$: Observable<MouseEvent> = fromEvent(
			taskCard,
			'mouseleave'
		);

		// Touch events
		const touchStart$: Observable<TouchEvent> = fromEvent(
			taskCard,
			'touchstart'
		);
		const touchEnd$: Observable<TouchEvent> = fromEvent(taskCard, 'touchend');
		const touchMove$: Observable<TouchEvent> = fromEvent(taskCard, 'touchmove');

		// Start of long hold
		const start$: Observable<number> = merge(touchStart$, mouseDown$).pipe(
			map(event => event.timeStamp),
			delay(EventResponse.Long)
		);

		// End of long hold
		const end$: Observable<number> = merge(
			mouseUp$,
			mouseMove$,
			mouseLeave$,
			touchEnd$,
			touchMove$
		).pipe(
			map(event => event.timeStamp),
			startWith(0)
		);

		// Long hold
		const longHold$ = start$.pipe(
			combineLatestWith(end$),
			map(([start, end]) => start > end),
			filter(isLongHold => isLongHold),
			map(() => null)
		);

		const released$: Observable<null> = merge(
			mouseUp$,
			touchEnd$,
			cdkDrag.released
		).pipe(map(() => null));

		// Short touch
		const touchEndTimed$: Observable<TouchEvent> = touchEnd$.pipe(
			takeUntil(timer(EventResponse.Short))
		);
		const shortTouch$ = touchStart$.pipe(
			switchMap(start => zip(of(start), touchEndTimed$)),
			map(([start, end]) => {
				const startY = (start as TouchEvent).changedTouches[0].clientY;
				const endY = (end as TouchEvent).changedTouches[0].clientY;

				return Math.abs(startY - endY);
			}),
			filter(distance => distance < 30)
		);

		// Short mouse click
		const mouseUpTimed$: Observable<MouseEvent> = mouseUp$.pipe(
			takeUntil(timer(EventResponse.Short))
		);
		const shortClick$ = mouseDown$.pipe(switchMap(() => mouseUpTimed$));

		// Short press
		const shortPress$: Observable<null> = merge(shortClick$, shortTouch$).pipe(
			map(() => null)
		);

		return { longHold$, released$, shortPress$ };
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
