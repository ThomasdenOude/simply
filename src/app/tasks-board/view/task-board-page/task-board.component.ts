import {
	Component,
	computed,
	inject,
	OnInit,
	signal,
	Signal,
	WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
	CdkDragDrop,
	DragDropModule,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { TaskService } from '../../services/task.service';
import { TaskEditComponent } from '../task-edit-page/task-edit.component';
import { TaskCardComponent } from '../../ui/task-card/task-card.component';
import { Task, TaskStatus } from '../../models/task.model';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { Devices } from '../../../base/models/devices';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
	selector: 'app-task-board-page',
	standalone: true,
	imports: [
		MatButtonModule,
		MatTabsModule,
		MatIconModule,
		MatCardModule,
		TaskEditComponent,
		DragDropModule,
		TaskCardComponent,
		NgClass,
		RouterLink,
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
	protected device: Signal<Devices> = this.responsiveService.device;
	private _taskList!: Signal<Task[]>;
	protected currentTabIndex: WritableSignal<number> = signal(0);

	ngOnInit(): void {
		this._taskList = this.taskService.taskList;
	}

	protected taskListSignal(status: TaskStatus): Signal<Task[]> {
		return computed(() =>
			this._taskList()
				.filter((task: Task) => task.status === status)
				.sort((a: Task, b: Task) => a.index - b.index)
		);
	}

	protected connectedListSignal(status: TaskStatus): Signal<string[]> {
		return computed(() => {
			const connectedList: string[] = [];

			this.taskStatuses
				.filter(taskStatus => taskStatus !== status)
				.forEach(taskStatus => {
					connectedList.push(taskStatus);
					if (this.device() !== Devices.WideScreen) {
						connectedList.push('TAB_' + taskStatus);
					}
				});
			return connectedList;
		});
	}

	protected selectedNewTab(currentTab: MatTabChangeEvent): void {
		if (currentTab.index !== this.currentTabIndex()) {
			this.currentTabIndex.set(currentTab.index);
		}
	}

	protected editTask(task: Task) {
		this.router.navigate(['task', task.id], { relativeTo: this.route });
	}

	protected newTask(): void {
		this.router.navigate(['task'], { relativeTo: this.route });
	}

	protected switchTab(status: TaskStatus): void {
		const newIndex = this.taskStatuses.indexOf(status);
		this.currentTabIndex.set(newIndex);
	}

	protected updateTask(event: CdkDragDrop<Task[]>, tabDrop = false): void {
		const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
		const previousList: Task[] = event.previousContainer.data;
		const previousIndex: number = event.previousIndex;

		const currentStatus: TaskStatus = (
			tabDrop ? event.container.id.slice(4) : event.container.id
		) as TaskStatus;
		const currentList: Task[] = tabDrop
			? this.taskListSignal(currentStatus)()
			: event.container.data;
		const currentIndex: number = tabDrop ? 0 : event.currentIndex;

		if (event.container === event.previousContainer) {
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
		if (tabDrop) {
			this.switchTab(currentStatus);
		}
	}
}
