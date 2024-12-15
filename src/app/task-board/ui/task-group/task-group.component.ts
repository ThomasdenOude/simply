import {
	Component,
	computed,
	EventEmitter,
	input,
	InputSignal,
	output,
	Output,
	OutputEmitterRef,
	Signal,
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
import { Devices } from '../../../base/models/devices.model';
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
		return this.dragEnabledId() ? null : this.editDoneId();
	});

	public updateTaskList: OutputEmitterRef<UpdateTaskListAndStatus> =
		output<UpdateTaskListAndStatus>();
	public newTask: OutputEmitterRef<void> = output<void>();
	public editTask: OutputEmitterRef<Task> = output<Task>();
	public editTaskDone: OutputEmitterRef<Task> = output<Task>();
	public statusChange: OutputEmitterRef<TaskStatus> = output<TaskStatus>();

	constructor() {
		this.taskStatusList = setTaskStatusList(this.taskList);
	}
	protected emitStatusChange(status: TaskStatus) {
		this.statusChange.emit(status);
	}

	protected emitNewTask(): void {
		this.newTask.emit();
	}

	protected emitEditTask(task: Task): void {
		this.editTask.emit(task);
	}

	protected emitEditTaskDone(task: Task): void {
		this.editTaskDone.emit(task);
	}

	protected dragEnabled(dragEnabled: boolean, task: Task): void {
		if (dragEnabled) {
			this.dragEnabledId.set(task.id);
		} else {
			this.dragEnabledId.set(null);
		}
	}
	public emitUpdateTaskList(
		event: CdkDragDrop<Task[]>,
		targetStatus?: TaskStatus
	): void {
		const updateTaskAndStatus: UpdateTaskListAndStatus = {
			taskDropped: event,
		};
		if (targetStatus) {
			updateTaskAndStatus.targetStatus = targetStatus;
		}
		this.updateTaskList.emit(updateTaskAndStatus);
	}
}
