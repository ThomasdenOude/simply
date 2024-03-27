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
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';

import { ResponsiveService } from '../../core/services/responsive.service';
import { TaskService } from '../services/task.service';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component';
import { TaskColumnComponent } from '../components/task-column/task-column.component';
import { TaskComponent } from '../components/task/task.component';
import { Task, TaskDialogData, TaskStatus } from '../models/task.interface';
import { Devices } from '../../core/models/devices';

@Component({
	selector: 'app-task-manager',
	standalone: true,
	imports: [
		MatButtonModule,
		MatTabsModule,
		MatIconModule,
		MatCardModule,
		TaskDialogComponent,
		TaskColumnComponent,
		DragDropModule,
		TaskComponent,
		NgClass,
	],
	templateUrl: './task-manager.component.html',
	styleUrl: './task-manager.component.scss',
})
export class TaskManagerComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private dialog: MatDialog = inject(MatDialog);
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected readonly Devices = Devices;
	protected readonly taskStatuses: TaskStatus[] = Object.values(TaskStatus);
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
		return computed(() =>
			this.taskStatuses
				.filter(taskStatus => taskStatus !== status)
				.map(taskStatus =>
					this.device() === Devices.WideScreen
						? taskStatus
						: 'TAB_' + taskStatus
				)
		);
	}

	protected tabChange(currentTab: MatTabChangeEvent): void {
		if (currentTab.index !== this.currentTabIndex()) {
			this.currentTabIndex.set(currentTab.index);
		}
	}

	protected tabDrop(event: CdkDragDrop<Task[]>): void {
		const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
		const previousList: Task[] = event.previousContainer.data;
		const previousIndex: number = event.previousIndex;

		const currentStatus: TaskStatus = event.container.id.slice(4) as TaskStatus;
		const currentList: Task[] = this.taskListSignal(currentStatus)();
		const currentIndex: number = 0;

		transferArrayItem(previousList, currentList, previousIndex, currentIndex);
		this.taskService.updateIndexAndStatus(
			previousStatus,
			previousList,
			currentStatus,
			currentList
		);
		const newIndex = this.taskStatuses.indexOf(currentStatus);
		this.currentTabIndex.set(newIndex);
	}

	protected addOrEditTask(task?: Task) {
		this.dialog.open<TaskDialogComponent, TaskDialogData, null>(
			TaskDialogComponent,
			{
				data: task ?? null,
			}
		);
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
	}
}
