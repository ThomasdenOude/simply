import {
	AfterViewInit,
	Component,
	computed,
	ElementRef,
	EventEmitter,
	inject,
	input,
	InputSignal,
	OnDestroy,
	Output,
	Renderer2,
	Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from 'rxjs';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
} from '@angular/cdk/drag-drop';

import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, TaskStatus } from '../../models/task.model';
import { UpdateTaskAndStatus } from '../../models/update-task-and-status';
import { EventResponse } from '../../models/event-response';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';

@Component({
	selector: 'simply-kanban',
	standalone: true,
	imports: [
		MatButton,
		RouterLink,
		DragDropModule,
		CdkDropListGroup,
		CdkDrag,
		CdkDropList,
		TaskCardComponent,
		MatIcon,
		NoSpaceDirective,
	],
	templateUrl: './kanban.component.html',
	styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements AfterViewInit, OnDestroy {
	private _destroy: Subject<void> = new Subject<void>();
	private _elementRef: ElementRef = inject(ElementRef);
	private _renderer: Renderer2 = inject(Renderer2);

	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon = taskStatusIcon;
	protected readonly EventResponse = EventResponse;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();

	@Output()
	public onUpdateTask: EventEmitter<UpdateTaskAndStatus> =
		new EventEmitter<UpdateTaskAndStatus>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	ngAfterViewInit() {
		this._renderer.addClass(
			this._elementRef.nativeElement,
			'simply-kanban__host'
		);
	}

	protected taskListSignal(status: TaskStatus): Signal<Task[]> {
		return computed(() =>
			this.taskList()
				.filter((task: Task) => task.status === status)
				.sort((a: Task, b: Task) => a.index - b.index)
		);
	}

	protected updateTask(event: CdkDragDrop<Task[]>): void {
		this.onUpdateTask.emit({ taskDropped: event });
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}

	ngOnDestroy() {
		this._destroy.next();
		this._destroy.complete();
	}
}
