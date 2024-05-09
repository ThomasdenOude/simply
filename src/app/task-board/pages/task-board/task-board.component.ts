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
import { Task, TaskStatus } from '../../models/task.model';
import { UpdateTaskAndStatus } from '../../models/update-task-and-status';
import { Devices } from '../../../base/models/devices';
import { TASK_STATUS_LIST } from '../../data/task-status-list';

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
export class TaskBoardComponent implements OnInit {
	private _taskService: TaskService = inject(TaskService);
	private _responsiveService: ResponsiveService = inject(ResponsiveService);
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);

	protected readonly Devices = Devices;
	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;

	protected device: Signal<Devices> = this._responsiveService.device;
	protected taskList!: Signal<Task[]>;
	protected taskStatusListItems: Signal<Task[]>[] = TASK_STATUS_LIST.map(
		(status: TaskStatus) =>
			computed(() =>
				this.taskList()
					.filter((task: Task) => task.status === status)
					.sort((a: Task, b: Task) => a.index - b.index)
			)
	);
	protected activeStatus: Signal<TaskStatus> =
		this._taskService.activeTaskStatus;

	ngOnInit(): void {
		this.taskList = this._taskService.taskList;
	}

	protected editTask(task: Task) {
		this._router.navigate(['task', task.id], { relativeTo: this._route });
	}

	protected newTask(): void {
		this._router.navigate(['task'], { relativeTo: this._route });
	}

	protected updateTask(update: UpdateTaskAndStatus): void {
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
			? this.taskStatuses.indexOf(update.targetStatus)
			: update.taskDropped.currentIndex;
		const currentList: Task[] = update.targetStatus
			? this.taskStatusListItems[currentIndex]()
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
