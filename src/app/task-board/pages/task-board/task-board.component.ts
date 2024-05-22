import { Component, inject, Signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
	DragDropModule,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { TaskService } from '../../services/task.service';
import { TaskGroupComponent } from '../../ui/task-group/task-group.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { KanbanComponent } from '../../ui/kanban/kanban.component';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';
import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { Task } from '../../models/task';
import { UpdateTaskListAndStatus } from '../../models/update-task-list-and-status';
import { Devices } from '../../../base/models/devices';
import { setTaskStatusList } from '../../helpers/set-task-list';
import { TaskStatus, TaskStatusList } from '../../models/task-status';

@Component({
	selector: 'simply-task-board',
	standalone: true,
	imports: [
		TaskCardComponent,
		NgClass,
		NgStyle,
		MatButtonModule,
		MatIconModule,
		DragDropModule,
		RouterLink,
		EditTaskComponent,
		TaskGroupComponent,
		NoSpaceDirective,
		KanbanComponent,
	],
	templateUrl: './task-board.component.html',
	styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent {
	private _taskService: TaskService = inject(TaskService);
	private _responsiveService: ResponsiveService = inject(ResponsiveService);
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);

	protected readonly Devices = Devices;
	protected readonly taskStatusList!: TaskStatusList;

	protected readonly taskList: Signal<Task[]>;
	protected readonly activeList: Signal<TaskStatus>;
	protected readonly editDoneId: Signal<string | null>;
	protected readonly device: Signal<Devices>;

	constructor() {
		this.taskList = this._taskService.taskList;
		this.activeList = this._taskService.activeList;
		this.editDoneId = this._taskService.editDoneId;
		this.taskStatusList = setTaskStatusList(this.taskList);
		this.device = this._responsiveService.device;
	}

	protected newTask(): void {
		this._router.navigate(['task'], { relativeTo: this._route });
	}

	protected editTask(task: Task) {
		this._router.navigate(['task', task.id], { relativeTo: this._route });
	}

	protected editTaskDone(task: Task): void {
		this._taskService.setEditTaskDone(task);
	}

	protected setActiveList(status: TaskStatus): void {
		this._taskService.setActiveList(status);
	}

	protected updateTaskList(update: UpdateTaskListAndStatus): void {
		const previousStatus: TaskStatus = update.taskDropped.previousContainer
			.id as TaskStatus;
		const previousList: Task[] = update.taskDropped.previousContainer.data;
		const previousIndex: number = update.taskDropped.previousIndex;

		const currentStatus: TaskStatus = (
			update.targetStatus
				? update.targetStatus
				: update.taskDropped.container.id
		) as TaskStatus;
		const currentIndex: number = update.targetStatus
			? 0
			: update.taskDropped.currentIndex;
		const currentList: Task[] = update.targetStatus
			? this.taskStatusList[currentStatus]()
			: update.taskDropped.container.data;
		if (
			update.taskDropped.container === update.taskDropped.previousContainer ||
			previousStatus === currentStatus
		) {
			moveItemInArray(currentList, previousIndex, currentIndex);
			this._taskService.updateIndex(currentStatus, currentList);
		} else {
			transferArrayItem(previousList, currentList, previousIndex, currentIndex);
			this._taskService.updateIndexAndStatus(
				previousStatus,
				previousList,
				currentStatus,
				currentList
			);
		}
	}
}
