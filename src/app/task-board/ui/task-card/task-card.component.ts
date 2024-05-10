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
	ViewChild,
} from '@angular/core';

import {
	combineLatestWith,
	delay,
	distinctUntilChanged,
	exhaustMap,
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	startWith,
	Subject,
	switchMap,
	takeUntil,
	timer,
	withLatestFrom,
} from 'rxjs';
import { MatCardModule } from '@angular/material/card';

import { Task } from '../../models/task.model';
import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { EventResponse } from '../../models/event-response';
import { CdkDrag } from '@angular/cdk/drag-drop';

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

		const { longHold$, shortPress$ } = this.initEvents(taskCard, this.ckgDrag);

		longHold$.subscribe(isLongPress => {
			if (isLongPress) {
				this.renderer.addClass(taskCard, 'task-card__active');
			} else {
				this.renderer.removeClass(taskCard, 'task-card__active');
			}
		});

		shortPress$.subscribe(() => this.emitEditTask());
	}

	protected emitEditTask(): void {
		this.editTask.emit(this.task());
	}

	private initEvents(taskCard: any, cdkDrag: CdkDrag) {
		// Mouse events
		const mouseDown$: Observable<MouseEvent> = fromEvent(taskCard, 'mousedown');
		const mouseUp$: Observable<MouseEvent> = fromEvent(taskCard, 'mouseup');
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

		// Touch move leave for long hold
		const touchMoveLeave$: Observable<boolean> = touchMove$.pipe(
			map((event: TouchEvent): boolean => {
				const y = event.touches[0].clientY;
				const x = event.touches[0].clientX;
				const element = document.elementFromPoint(x, y);

				return !element?.classList.contains('task-card__element') ?? true;
			}),
			distinctUntilChanged(),
			filter(event => event)
		);

		// Start of long hold
		const start$: Observable<number> = merge(touchStart$, mouseDown$).pipe(
			map(event => Date.now()),
			delay(EventResponse.Long)
		);

		// End of long hold
		const end$: Observable<number> = merge(
			mouseUp$,
			mouseLeave$,
			touchEnd$,
			touchMoveLeave$,
			this.ckgDrag.released
		).pipe(
			map(() => Date.now()),
			startWith(Date.now())
		);

		// Long hold
		const longHold$ = start$.pipe(
			takeUntil(this.destroy),
			combineLatestWith(end$),
			map(([start, end]) => start > end)
		);

		// Short touch
		const touchEndTimed$: Observable<TouchEvent> = touchEnd$.pipe(
			takeUntil(timer(EventResponse.Short))
		);
		const shortTouch$ = touchStart$.pipe(
			withLatestFrom(touchEndTimed$),
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
		const shortPress$ = merge(shortClick$, shortTouch$).pipe(
			takeUntil(this.destroy),
			map(() => null)
		);

		return { longHold$, shortPress$ };
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
