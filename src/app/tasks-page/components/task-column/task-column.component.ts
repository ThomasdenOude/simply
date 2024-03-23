import {
	Component,
	EventEmitter,
	InputSignal,
	Output,
	Signal,
	computed,
	input,
} from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import {
	DragDropModule,
	CdkDragDrop,
	transferArrayItem,
	moveItemInArray,
} from '@angular/cdk/drag-drop';

import {
	TaskStatus,
	Task,
	UpdateTaskIndex,
	UpdateTaskIndexAndStatus,
} from '../../models/task.interface';
import { TaskComponent } from '../task/task.component';

@Component({
	selector: 'app-task-column',
	standalone: true,
	imports: [DragDropModule, LowerCasePipe, TaskComponent],
	templateUrl: './task-column.component.html',
	styleUrl: './task-column.component.scss',
})
export class TaskColumnComponent {
	public taskStatus: InputSignal<TaskStatus> = input.required<TaskStatus>();
	public taskList: InputSignal<Task[]> = input.required<Task[]>();

	protected connectedStatusesList: Signal<TaskStatus[]> = computed(() =>
		Object.values(TaskStatus).filter(status => status !== this.taskStatus())
	);
	protected taskColumnList: Signal<Task[]> = computed(() =>
		this.taskList()
			.filter((task: Task) => task.status === this.taskStatus())
			.sort((a: Task, b: Task) => a.index - b.index)
	);

	@Output() taskEdit: EventEmitter<Task> = new EventEmitter<Task>();

	@Output() updateIndex: EventEmitter<UpdateTaskIndex> =
		new EventEmitter<UpdateTaskIndex>();

	@Output() updateIndexAndStatus: EventEmitter<UpdateTaskIndexAndStatus> =
		new EventEmitter<UpdateTaskIndexAndStatus>();

	protected updateTask(event: CdkDragDrop<Task[]>): void {
		const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
		const previousList: Task[] = event.previousContainer.data;
		const previousIndex: number = event.previousIndex;

		const currentStatus: TaskStatus = event.container.id as TaskStatus;
		const currentList: Task[] = event.container.data;
		const currentIndex: number = event.currentIndex;

		if (event.container === event.previousContainer) {
			moveItemInArray(currentList, previousIndex, currentIndex);
			this.updateIndex.next({
				currentStatus: currentStatus,
				currentList: currentList,
			});
		} else {
			transferArrayItem(previousList, currentList, previousIndex, currentIndex);
			this.updateIndexAndStatus.next({
				previousStatus: previousStatus,
				previousList: previousList,
				currentStatus: currentStatus,
				currentList: currentList,
			});
		}
	}

	protected editTask(task: Task): void {
		this.taskEdit.emit(task);
	}
}
