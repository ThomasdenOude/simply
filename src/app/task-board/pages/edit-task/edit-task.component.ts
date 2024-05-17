import {
	Component,
	computed,
	inject,
	Input,
	OnDestroy,
	OnInit,
	Signal,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { Subject } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatOption, MatSelect } from '@angular/material/select';

import { TaskService } from '../../services/task.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import {
	CreateTask,
	CreateTaskForm,
	Task,
	TaskStatus,
	TaskStatusIcons,
} from '../../models/task.model';
import { Devices } from '../../../base/models/devices';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';

@Component({
	selector: 'simply-edit-task',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatIconModule,
		MatFormFieldModule,
		MatButtonModule,
		NgClass,
		CenterPageComponent,
		MatSelect,
		MatOption,
		FocusInputDirective,
		SpaceContentDirective,
	],
	templateUrl: './edit-task.component.html',
	styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent implements OnInit, OnDestroy {
	private _destroy: Subject<void> = new Subject<void>();
	private _taskService: TaskService = inject(TaskService);
	private _responsiveService: ResponsiveService = inject(ResponsiveService);
	private _router: Router = inject(Router);

	protected device: Signal<Devices> = this._responsiveService.device;
	protected textAreaMinRows: Signal<number>;
	protected textAreaMaxRows: Signal<number>;
	protected activeTaskStatus: Signal<TaskStatus> = this._taskService.activeList;
	protected availableStatuses: Signal<TaskStatus[]> = computed<TaskStatus[]>(
		() => TASK_STATUS_LIST.filter(status => status !== this.activeTaskStatus())
	);

	protected task: Task | undefined;
	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly Devices = Devices;
	protected taskForm: FormGroup<CreateTaskForm> = new FormGroup<CreateTaskForm>(
		{
			title: new FormControl(''),
			description: new FormControl(''),
			status: new FormControl(TaskStatus.Todo),
		}
	);

	@Input()
	private set id(taskId: string) {
		this.task = this._taskService.getTask(taskId);
	}

	constructor() {
		this.textAreaMinRows = computed(() => {
			if (this.device() === Devices.HandsetLandscape) {
				return 4;
			} else if (this.device() === Devices.HandsetPortrait) {
				return 6;
			}
			return 12;
		});
		this.textAreaMaxRows = computed(() => this.textAreaMinRows() * 2);
	}

	ngOnInit() {
		if (this.task) {
			this.taskForm.patchValue({
				title: this.task.title,
				description: this.task.description,
				status: this.task.status,
			});
			this._taskService.setActiveList(this.task.status);
		} else {
			this._taskService.setActiveList(TaskStatus.Todo);
		}
	}

	protected submitTask(): void {
		const formValue = this.taskForm.value;

		if (this.task) {
			const status: TaskStatus = formValue.status ?? this.task.status;
			const editedTask: Task = {
				...this.task,
				title: formValue.title ?? this.task.title,
				description: formValue.description ?? this.task.description,
				status: status,
			};
			this._taskService
				.editTask(editedTask)
				.then(result => {
					this._taskService.setActiveList(status);
					this.navigateToTaskBoard();
				})
				.catch();
		} else {
			const status: TaskStatus = formValue.status ?? TaskStatus.Todo;
			const addedTask: CreateTask = {
				title: formValue.title ?? '',
				description: formValue.description ?? '',
				status: status,
			};
			this._taskService
				.addTask(addedTask)
				.then(result => {
					this._taskService.setActiveList(status);
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	protected deleteTask(): void {
		if (this.task) {
			this._taskService
				.deleteTask(this.task)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	private navigateToTaskBoard(): void {
		this._router.navigate(['/task-board']);
	}

	protected cancel(): void {
		this.navigateToTaskBoard();
	}

	ngOnDestroy() {
		this._destroy.next();
		this._destroy.complete();
	}
}
