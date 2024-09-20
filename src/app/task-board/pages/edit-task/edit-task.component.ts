import {
	Component,
	computed,
	inject,
	input,
	InputSignal,
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
import { CreateTask, CreateTaskForm, Task } from '../../models/task';
import { Devices } from '../../../base/models/devices.model';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { TaskStatus, TaskStatusIcons } from '../../models/task-status';
import { TASK_BOARD_ROUTE } from '../../../base/guards/auth-guards';

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
export class EditTaskComponent implements OnInit {
	private _taskService: TaskService = inject(TaskService);
	private _responsiveService: ResponsiveService = inject(ResponsiveService);
	private _router: Router = inject(Router);

	protected device: Signal<Devices> = this._responsiveService.device;
	protected textAreaMinRows: Signal<number> = computed(() => {
		if (this.device() === Devices.HandsetLandscape) {
			return 4;
		} else if (this.device() === Devices.HandsetPortrait) {
			return 6;
		}
		return 12;
	});
	protected textAreaMaxRows: Signal<number> = computed(
		() => this.textAreaMinRows() * 2
	);
	protected activeTaskStatus: Signal<TaskStatus> = this._taskService.activeList;
	protected availableStatuses: Signal<TaskStatus[]> = computed<TaskStatus[]>(
		() => TASK_STATUS_LIST.filter(status => status !== this.activeTaskStatus())
	);

	protected readonly taskStatusIcon: TaskStatusIcons = taskStatusIcon;
	protected readonly Devices = Devices;
	protected taskForm: FormGroup<CreateTaskForm> = new FormGroup<CreateTaskForm>(
		{
			title: new FormControl(''),
			description: new FormControl(''),
			status: new FormControl(TaskStatus.Todo),
		}
	);

	protected id: InputSignal<string | undefined> = input<string>();

	protected task: Signal<Task | undefined> = computed(() => {
		const id = this.id();
		if (id) {
			return this._taskService.getTask(id);
		}
		return undefined;
	});

	ngOnInit() {
		const task = this.task();
		if (task) {
			this.taskForm.patchValue({
				title: task.title,
				description: task.description,
				status: task.status,
			});
			this._taskService.setActiveList(task.status);
		} else {
			this._taskService.setActiveList(TaskStatus.Todo);
		}
	}

	protected submitTask(): void {
		const formValue = this.taskForm.value;
		const task = this.task();
		if (task) {
			const status: TaskStatus = formValue.status ?? task.status;
			const editedTask: Task = {
				...task,
				title: formValue.title ?? task.title,
				description: formValue.description ?? task.description,
				status: status,
			};
			this._taskService
				.editTask(editedTask)
				.then(() => {
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
				.then(() => {
					this._taskService.setActiveList(status);
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	protected deleteTask(): void {
		const task = this.task();
		if (task) {
			this._taskService
				.deleteTask(task)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	private navigateToTaskBoard(): void {
		void this._router.navigate(TASK_BOARD_ROUTE);
	}

	protected cancel(): void {
		this.navigateToTaskBoard();
	}
}
