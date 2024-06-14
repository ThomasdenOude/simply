import {
  Component, computed,
  EventEmitter,
  input,
  InputSignal,
  Output, Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

import { TaskCardComponent } from '../task-card/task-card.component';
import { Devices } from '../../../base/models/devices';
import { Task } from '../../models/task';
import { UpdateTaskListAndStatus } from '../../models/update-task-list-and-status';
import { EventResponse } from '../../models/event-response';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { setTaskStatusList } from '../../helpers/set-task-list';
import {
	TaskStatus,
	TaskStatusIcons,
	TaskStatusList,
} from '../../models/task-status';
import { toTabStatus } from '../../helpers/to-tab-status';

@Component({
	selector: 'simply-task-group',
	standalone: true,
	imports: [
		NgClass,
		CdkDropListGroup,
		MatIcon,
		CdkDropList,
		CdkDrag,
		TaskCardComponent,
		MatMiniFabButton,
	],
	templateUrl: './task-group.component.html',
	styleUrl: './task-group.component.scss',
})
export class TaskGroupComponent {
	protected readonly Devices = Devices;
	protected readonly EventResponse = EventResponse;
	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly taskStatusList: TaskStatusList;
	protected readonly toTabStatus = toTabStatus;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();
	public activeList: InputSignal<TaskStatus> = input.required<TaskStatus>();
	public device: InputSignal<Devices> = input.required<Devices>();
	public editDoneId: InputSignal<string | null> = input.required();

	protected readonly dragEnabledId: WritableSignal<string | null> =
		signal(null);
  protected showEditDoneId: Signal<string | null> = computed(() => {
    return this.dragEnabledId() ? null : this.editDoneId()
  })

	@Output()
	public onUpdateTaskList: EventEmitter<UpdateTaskListAndStatus> =
		new EventEmitter<UpdateTaskListAndStatus>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	@Output()
	public onEditTaskDone: EventEmitter<Task> = new EventEmitter<Task>();

	@Output()
	public onStatusChange: EventEmitter<TaskStatus> =
		new EventEmitter<TaskStatus>();

	constructor() {
		this.taskStatusList = setTaskStatusList(this.taskList);
	}
	protected selectStatus(status: TaskStatus) {
		this.onStatusChange.emit(status);
	}

	protected newTask(): void {
		this.onNewTask.emit();
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}

	protected editTaskDone(task: Task): void {
		this.onEditTaskDone.emit(task);
	}

	protected dragEnabled(dragEnabled: boolean, task: Task): void {
		if (dragEnabled) {
			this.dragEnabledId.set(task.id);
		} else {
			this.dragEnabledId.set(null);
		}
	}
	public updateTaskList(
		event: CdkDragDrop<Task[]>,
		targetStatus?: TaskStatus
	): void {
		const updateTaskAndStatus: UpdateTaskListAndStatus = {
			taskDropped: event,
		};
		if (targetStatus) {
			updateTaskAndStatus.targetStatus = targetStatus;
		}
		this.onUpdateTaskList.emit(updateTaskAndStatus);
	}
}
