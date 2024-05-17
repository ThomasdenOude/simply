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
	withLatestFrom,
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
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	@Output()
	public onDragEnabled: EventEmitter<boolean> = new EventEmitter<boolean>();

	ngAfterViewInit() {
		const taskCard = this.elementRef.nativeElement;
		this.renderer.addClass(taskCard, 'task-card__host');

		const { longHold$, released$, shortPress$ } = this.initEvents(
			taskCard,
			this.ckgDrag
		);

		longHold$
			.pipe(
				takeUntil(this.destroy),
				tap(() => this.onDragEnabled.emit(true)),
				switchMap(() => released$),
				tap(() => this.onDragEnabled.emit(false))
			)
			.subscribe();

		shortPress$
			.pipe(takeUntil(this.destroy))
			.subscribe(() => this.emitEditTask());
	}

	protected emitEditTask(): void {
		this.onEditTask.emit(this.task());
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

		/*
		 *   Long hold
		 *
		 *     - Start hold with delay, cancel on end hold
		 */
		const startHoldDelayed$: Observable<number> = merge(
			touchStart$,
			mouseDown$
		).pipe(
			map(event => event.timeStamp),
			delay(EventResponse.Middle)
		);

		const endHold$: Observable<number> = merge(
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
		const longHold$ = startHoldDelayed$.pipe(
			combineLatestWith(endHold$),
			map(([start, end]) => start > end),
			filter(isLongHold => isLongHold),
			map(() => null)
		);

		/*
		 *   Released
		 *
		 *     - Released after drag or touchend / mouseup
		 */
		const released$: Observable<null> = merge(
			mouseUp$,
			touchEnd$,
			cdkDrag.released
		).pipe(map(() => null));

		/*
		 *   Short press
		 *
		 *     - Short touch on card ( don't fire if scrolled over card )
		 *     - Short mouse click, but cancel if touchend happened shortly before
		 *
		 */

		// Short touch on card
		const touchEndTimed$: Observable<TouchEvent> = touchEnd$.pipe(
			takeUntil(timer(EventResponse.Short))
		);

		const shortTouchOnCard$ = touchStart$.pipe(
			switchMap(start => zip(of(start), touchEndTimed$)),
			map(([start, end]) => {
				const startY = (start as TouchEvent).changedTouches[0].clientY;
				const endY = (end as TouchEvent).changedTouches[0].clientY;

				return Math.abs(startY - endY);
			}),
			filter(distance => distance < 30)
		);

		// Short mouse click, no touch end
		const mouseUpTimed$: Observable<MouseEvent> = mouseUp$.pipe(
			takeUntil(timer(EventResponse.Short))
		);

		const touchendTimestamp$: Observable<number> = touchEnd$.pipe(
			map(touchEnd => touchEnd.timeStamp),
			startWith(0)
		);

		const shortClickNoTouchend$ = mouseDown$.pipe(
			map(mouseDown => mouseDown.timeStamp),
			withLatestFrom(touchendTimestamp$),
			map(([mouseDown, touchEnd]) => {
				const touchendBeforeSeconds = mouseDown - touchEnd;

				return (
					touchEnd === 0 ||
					(touchendBeforeSeconds < 0 &&
						touchendBeforeSeconds > EventResponse.Long)
				);
			}),
			filter(noTouchEndBefore => noTouchEndBefore),
			switchMap(() => mouseUpTimed$)
		);

		// Short press
		const shortPress$: Observable<null> = merge(
			shortClickNoTouchend$,
			shortTouchOnCard$
		).pipe(map(() => null));

		return { longHold$, released$, shortPress$ };
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
