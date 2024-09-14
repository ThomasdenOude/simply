import {
	Component,
	input,
	InputSignal,
	output,
	OutputEmitterRef,
	signal,
	WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
export class KanbanComponent {
	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly EventResponse = EventResponse;
	protected readonly taskStatusList: TaskStatusList;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();
	public editDoneId: InputSignal<string | null> = input.required();
	protected dragEnabledId: WritableSignal<string | null> = signal(null);

	public updateTaskList: OutputEmitterRef<UpdateTaskListAndStatus> =
		output<UpdateTaskListAndStatus>();
	public editTask: OutputEmitterRef<Task> = output<Task>();
	public editTaskDone: OutputEmitterRef<Task> = output<Task>();

	constructor() {
		this.taskStatusList = setTaskStatusList(this.taskList);
	}

	protected emitUpdateTaskList(event: CdkDragDrop<Task[]>): void {
		this.updateTaskList.emit({ taskDropped: event });
	}

	protected emitEditTask(task: Task): void {
		this.editTask.emit(task);
	}

	protected setDragState(dragEnabled: boolean, task: Task): void {
		if (dragEnabled) {
			this.dragEnabledId.set(task.id);
		} else {
			this.dragEnabledId.set(null);
		}
	}

	protected emitEditTaskDone(task: Task): void {
		this.editTaskDone.emit(task);
	}
}
