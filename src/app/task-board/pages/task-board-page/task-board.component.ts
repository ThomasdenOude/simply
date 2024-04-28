import {
	Component,
	computed,
	inject,
	OnInit,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';

import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { TaskService } from '../../services/task.service';
import { TaskBoardTabDirective } from '../../directives/task-board-tab.directive';
import { TaskBoardGroupComponent } from '../../ui/task-board-group/task-board-group.component';
import { TaskListComponent } from '../../ui/task-list/task-list.component';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';
import { Task, TaskStatus, TaskStatusIcons } from '../../models/task.model';
import { Devices } from '../../../base/models/devices';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';

@Component({
	selector: 'app-task-board-page',
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
		TaskBoardTabDirective,
		TaskBoardGroupComponent,
		TaskListComponent,
	],
	templateUrl: './task-board.component.html',
	styleUrl: './task-board.component.scss',
})
export class TaskBoardComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);
	private route: ActivatedRoute = inject(ActivatedRoute);

	protected readonly Devices = Devices;
	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;

	protected device: Signal<Devices> = this.responsiveService.device;
	private _taskList!: Signal<Task[]>;
	protected taskStatusListItems: Signal<Task[]>[] = TASK_STATUS_LIST.map(
		(status: TaskStatus) =>
			computed(() =>
				this._taskList()
					.filter((task: Task) => task.status === status)
					.sort((a: Task, b: Task) => a.index - b.index)
			)
	);
	protected activeStatus: WritableSignal<TaskStatus> = signal(TaskStatus.Todo);

	ngOnInit(): void {
		this._taskList = this.taskService.taskList;
		this.setEditedStatus();
	}

	private setEditedStatus(): void {
		if (this.device() !== Devices.WideScreen) {
			const params: Params = this.route.snapshot.queryParams;
			const status = params['status'];
			if (status) {
				const taskStatus = status.toUpperCase() as TaskStatus;
				this.activeStatus.set(taskStatus);
			}
		}
	}

	protected taskListSignal(status: TaskStatus): Signal<Task[]> {
		return computed(() =>
			this._taskList()
				.filter((task: Task) => task.status === status)
				.sort((a: Task, b: Task) => a.index - b.index)
		);
	}

	protected selectStatus(status: TaskStatus) {
		this.activeStatus.set(status);
	}

	protected editTask(task: Task) {
		this.router.navigate(['task', task.id], { relativeTo: this.route });
	}

	protected newTask(): void {
		this.router.navigate(['task'], { relativeTo: this.route });
	}

	protected switchTab(status: TaskStatus): void {
		this.activeStatus.set(status);
	}

	protected updateTask(
		event: CdkDragDrop<Task[]>,
		targetStatus?: TaskStatus
	): void {
		const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
		const previousList: Task[] = event.previousContainer.data;
		const previousIndex: number = event.previousIndex;

		const currentStatus: TaskStatus = (
			targetStatus ? targetStatus : event.container.id
		) as TaskStatus;
		const currentIndex: number = targetStatus
			? this.taskStatuses.indexOf(targetStatus)
			: event.currentIndex;
		const currentList: Task[] = targetStatus
			? this.taskStatusListItems[currentIndex]()
			: event.container.data;
		if (
			event.container === event.previousContainer ||
			previousStatus === currentStatus
		) {
			moveItemInArray(currentList, previousIndex, currentIndex);
			this.taskService.updateIndex(currentStatus, currentList);
		} else {
			transferArrayItem(previousList, currentList, previousIndex, currentIndex);
			this.taskService.updateIndexAndStatus(
				previousStatus,
				previousList,
				currentStatus,
				currentList
			);
		}
	}
}
