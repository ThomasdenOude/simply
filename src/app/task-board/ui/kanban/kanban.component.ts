import {
	Component,
	computed,
	ElementRef,
	EventEmitter,
	inject,
	input,
	InputSignal,
	Output,
	Renderer2,
	Signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButton } from '@angular/material/button';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
} from '@angular/cdk/drag-drop';

import { TaskCardComponent } from '../task-card/task-card.component';
import { Task, TaskStatus } from '../../models/task.model';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { MatIcon } from '@angular/material/icon';
import { NoSpaceDirective } from '../../../base/directives/no-space.directive';

@Component({
	selector: 'simply-kanban',
	standalone: true,
	imports: [
		MatButton,
		RouterLink,
		DragDropModule,
		CdkDropListGroup,
		CdkDrag,
		CdkDropList,
		TaskCardComponent,
		MatIcon,
		NoSpaceDirective,
	],
	templateUrl: './kanban.component.html',
	styleUrl: './kanban.component.scss',
})
export class KanbanComponent {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);

	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon = taskStatusIcon;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();

	@Output()
	public onUpdateTask: EventEmitter<CdkDragDrop<Task[]>> = new EventEmitter<
		CdkDragDrop<Task[]>
	>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	constructor() {
		this.renderer.addClass(
			this.elementRef.nativeElement,
			'simply-kanban__host'
		);
	}
	protected taskListSignal(status: TaskStatus): Signal<Task[]> {
		return computed(() =>
			this.taskList()
				.filter((task: Task) => task.status === status)
				.sort((a: Task, b: Task) => a.index - b.index)
		);
	}

	protected updateTask(event: CdkDragDrop<Task[]>): void {
		this.onUpdateTask.emit(event);
	}

	protected newTask(): void {
		this.onNewTask.emit();
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}
}
