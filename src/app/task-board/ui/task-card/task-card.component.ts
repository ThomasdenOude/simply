import {
	Component,
	InputSignal,
	input,
	ElementRef,
	AfterViewInit,
	OnDestroy,
	inject,
	Renderer2,
	OutputEmitterRef,
	output,
} from '@angular/core';

import {
	combineLatestWith,
	delay,
	filter,
	fromEvent,
	map,
	merge,
	Observable,
	Subject,
	switchMap,
	takeUntil,
	tap,
	timer,
} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';

import { EventResponse } from '../../models/event-response';
import { Task } from '../../models/task';

@Component({
	selector: 'simply-task-card',
	standalone: true,
	imports: [MatCardModule],
	templateUrl: './task-card.component.html',
	styleUrl: './task-card.component.scss',
})
export class TaskCardComponent implements AfterViewInit, OnDestroy {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);
	private ckgDrag: CdkDrag = inject(CdkDrag);

	private destroy: Subject<void> = new Subject<void>();

	public task: InputSignal<Task> = input.required<Task>();

	public editTask: OutputEmitterRef<Task> = output<Task>();
	public dragEnabled: OutputEmitterRef<boolean> = output<boolean>();

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
				tap(() => this.dragEnabled.emit(true)),
				switchMap(() => released$),
				tap(() => this.dragEnabled.emit(false))
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
		// Pointer events
		const pointerDown$: Observable<PointerEvent> = fromEvent(
			taskCard,
			'pointerdown'
		);
		const pointerMove$: Observable<PointerEvent> = fromEvent(
			taskCard,
			'pointermove'
		);

		const pointerUp$: Observable<PointerEvent> = fromEvent(
			taskCard,
			'pointerup'
		);

		/*
		 *   Long hold
		 *
		 *     - Start hold with delayed pointer down, end hold  on end hold on pointer up or pointer move
		 */
		const startPointerDelayed$: Observable<number> = pointerDown$.pipe(
			map(event => event.timeStamp),
			delay(EventResponse.Middle)
		);

		const endPointer$: Observable<number> = merge(
			pointerUp$,
			pointerMove$
		).pipe(map(event => event.timeStamp));

		const longHold$ = startPointerDelayed$.pipe(
			combineLatestWith(endPointer$),
			map(([start, end]) => start > end),
			filter(isLongHold => isLongHold),
			map(() => null)
		);

		/*
		 *   Released
		 *
		 *     - Released after pointer up or CdkDragRelease event
		 */
		const released$: Observable<null> = merge(
			pointerUp$,
			cdkDrag.released
		).pipe(map(() => null));

		/*
		 *   Short press
		 *
		 *   Pointer up shortly after pointer down event
		 */
		const pointerEndTimed$: Observable<PointerEvent> = pointerUp$.pipe(
			takeUntil(timer(EventResponse.Short))
		);

		const shortPress$: Observable<null> = pointerDown$.pipe(
			switchMap(() => pointerEndTimed$),
			map(() => null)
		);

		return { longHold$, released$, shortPress$ };
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
