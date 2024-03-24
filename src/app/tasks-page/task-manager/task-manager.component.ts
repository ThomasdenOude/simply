import {
	Component,
	OnInit,
	Signal,
	inject,
	WritableSignal,
	signal,
	computed,
} from '@angular/core';

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
import { TaskDialogData, TaskStatus, Task } from '../models/task.interface';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component';
import { TaskColumnComponent } from '../components/task-column/task-column.component';
import { TaskService } from '../services/task.service';
import { TaskComponent } from '../components/task/task.component';

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
	],
	templateUrl: './task-manager.component.html',
	styleUrl: './task-manager.component.scss',
})
export class TaskManagerComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private dialog: MatDialog = inject(MatDialog);

	protected taskList!: Signal<Task[]>;
	protected taskStatuses: TaskStatus[] = Object.values(TaskStatus);
	protected currentTabIndex: WritableSignal<number> = signal(0);
	protected currentStatus: Signal<TaskStatus> = computed(
		() => this.taskStatuses[this.currentTabIndex()]
	);
	protected currentList: Signal<Task[]> = computed(() =>
		this.taskList()
			.filter((task: Task) => task.status === this.currentStatus())
			.sort((a: Task, b: Task) => a.index - b.index)
	);
	protected connectedLists: Signal<string[]> = computed(() =>
		this.taskStatuses
			.filter(taskStatus => taskStatus !== this.currentStatus())
			.map(taskStatus => 'TAB_' + taskStatus)
	);

	ngOnInit(): void {
		this.taskList = this.taskService.taskList;
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
		const currentList: Task[] = this.taskList().filter(
			task => task.status === currentStatus
		);
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

	protected editTask(task?: Task) {
		this.dialog.open<TaskDialogComponent, TaskDialogData, null>(
			TaskDialogComponent,
			{
				data: task ?? null,
			}
		);
	}

	protected updateTask(event: CdkDragDrop<Task[]>): void {
		const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
		const previousList: Task[] = event.previousContainer.data;
		const previousIndex: number = event.previousIndex;

		const currentStatus: TaskStatus = event.container.id as TaskStatus;
		const currentList: Task[] = event.container.data;
		const currentIndex: number = event.currentIndex;

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
