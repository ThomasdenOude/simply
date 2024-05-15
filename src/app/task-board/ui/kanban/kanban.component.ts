import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	OnDestroy,
	Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Subject } from 'rxjs';

import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
	DragDropModule,
} from '@angular/cdk/drag-drop';

import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { TaskCardComponent } from '../task-card/task-card.component';
import {
	Task,
	TaskStatus,
	TaskStatusIcons,
	TaskStatusList,
} from '../../models/task.model';
import { UpdateTaskListAndStatus } from '../../models/update-task-list-and-status';
import { EventResponse } from '../../models/event-response';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { setTaskStatusList } from '../../helpers/set-task-list';

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
export class KanbanComponent implements OnDestroy {
	private _destroy: Subject<void> = new Subject<void>();

	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly EventResponse = EventResponse;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();
	protected readonly taskStatusList: TaskStatusList;

	@Output()
	public onUpdateTaskList: EventEmitter<UpdateTaskListAndStatus> =
		new EventEmitter<UpdateTaskListAndStatus>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	constructor() {
		this.taskStatusList = setTaskStatusList(this.taskList);
	}

	protected updateTaskList(event: CdkDragDrop<Task[]>): void {
		this.onUpdateTaskList.emit({ taskDropped: event });
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}

	ngOnDestroy() {
		this._destroy.next();
		this._destroy.complete();
	}
}
