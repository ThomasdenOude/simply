import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	OnDestroy,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from 'rxjs';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
} from '@angular/cdk/drag-drop';

import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task';
import { UpdateTaskListAndStatus } from '../../models/update-task-list-and-status';
import { EventResponse } from '../../models/event-response';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { setTaskStatusList } from '../../helpers/set-task-list';
import { NgClass } from '@angular/common';
import {
	TaskStatus,
	TaskStatusIcons,
	TaskStatusList,
} from '../../models/task-status';

@Component({
	selector: 'simply-kanban',
	standalone: true,
	imports: [
		MatButtonModule,
		RouterLink,
		DragDropModule,
		CdkDropListGroup,
		CdkDrag,
		CdkDropList,
		TaskCardComponent,
		MatIconModule,
		NgClass,
	],
	templateUrl: './kanban.component.html',
	styleUrl: './kanban.component.scss',
})
export class KanbanComponent implements OnDestroy {
	private _destroy: Subject<void> = new Subject<void>();

	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly EventResponse = EventResponse;
	protected readonly taskStatusList: TaskStatusList;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();
	public editDoneId: InputSignal<string | null> = input.required();
	protected dragEnabledId: WritableSignal<string | null> = signal(null);

	@Output()
	public onUpdateTaskList: EventEmitter<UpdateTaskListAndStatus> =
		new EventEmitter<UpdateTaskListAndStatus>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	@Output()
	public onEditTaskDone: EventEmitter<Task> = new EventEmitter<Task>();

	constructor() {
		this.taskStatusList = setTaskStatusList(this.taskList);
	}

	protected updateTaskList(event: CdkDragDrop<Task[]>): void {
		this.onUpdateTaskList.emit({ taskDropped: event });
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}

	protected setDragState(dragEnabled: boolean, task: Task): void {
		if (dragEnabled) {
			this.dragEnabledId.set(task.id);
		} else {
			this.dragEnabledId.set(null);
		}
	}

	protected editTaskDone(task: Task): void {
		this.onEditTaskDone.emit(task);
	}

	ngOnDestroy() {
		this._destroy.next();
		this._destroy.complete();
	}
}
