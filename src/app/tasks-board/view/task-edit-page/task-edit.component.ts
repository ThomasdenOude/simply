import {
	Component,
	computed,
	inject,
	Input,
	OnInit,
	signal,
	Signal,
	WritableSignal,
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
import {
	CreateTask,
	CreateTaskForm,
	Task,
	TaskStatus,
} from '../../models/task.model';
import { Devices } from '../../../base/models/devices';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { taskStatusIcon } from '../../data/task-status-icon.map';
import { TASK_STATUS_LIST } from '../../data/task-status-list';

@Component({
	selector: 'app-task-edit-page',
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
	],
	templateUrl: './task-edit.component.html',
	styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected currentStatus: WritableSignal<TaskStatus> = signal(TaskStatus.Todo);
	protected availableStatuses: Signal<TaskStatus[]> = computed(() =>
		TASK_STATUS_LIST.filter(status => status !== this.currentStatus())
	);
	protected task: Task | undefined;
	protected taskForm!: FormGroup<CreateTaskForm>;

	@Input()
	private set id(taskId: string) {
		this.task = this.taskService.getTask(taskId);
	}

	ngOnInit() {
		const editStatus = this.task?.status;
		if (editStatus) {
			this.currentStatus.set(editStatus);
		}
		this.taskForm = new FormGroup<CreateTaskForm>({
			title: new FormControl(this.task?.title ?? ''),
			description: new FormControl(this.task?.description ?? ''),
			status: new FormControl(this.currentStatus()),
		});
		this.taskForm
			.get('status')
			?.valueChanges.subscribe((status: TaskStatus | null) => {
				if (status) {
					this.currentStatus.set(status);
				}
			});
	}

	protected submitTask(): void {
		const formValue = this.taskForm.value;

		if (this.task) {
			const editedTask: Task = {
				...this.task,
				title: formValue.title ?? this.task.title,
				description: formValue.description ?? this.task.description,
				status: formValue.status ?? this.task.status,
			};
			this.taskService
				.editTask(editedTask)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		} else {
			const addedTask: CreateTask = {
				title: formValue.title ?? '',
				description: formValue.description ?? '',
				status: formValue.status ?? TaskStatus.Todo,
			};
			this.taskService
				.addTask(addedTask)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	protected deleteTask(): void {
		if (this.task) {
			this.taskService
				.deleteTask(this.task)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		}
	}

	private navigateToTaskBoard(): void {
		this.router.navigate(['/task-board']);
	}

	protected cancel(): void {
		this.navigateToTaskBoard();
	}

	protected readonly TASK_STATUS_LIST = TASK_STATUS_LIST;
	protected readonly taskStatusIcon = taskStatusIcon;
	protected readonly TaskStatus = TaskStatus;
}
