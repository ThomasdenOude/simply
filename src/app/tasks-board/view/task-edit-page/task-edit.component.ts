import { Component, OnInit, inject, Signal, Input } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TaskService } from '../../services/task.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { Task } from '../../models/task.model';
import {
	CreateTask,
	CreateTaskFormGroup,
	TaskStatus,
} from '../../models/task.model';
import { Devices } from '../../../base/models/devices';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';

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
		MatTooltipModule,
		NgClass,
		CenterPageComponent,
	],
	templateUrl: './task-edit.component.html',
	styleUrl: './task-edit.component.scss',
})
export class TaskEditComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected task: Task | undefined;

	private formBuilder: FormBuilder = new FormBuilder();

	protected taskForm!: CreateTaskFormGroup;

	@Input()
	private set id(taskId: string) {
		this.task = this.taskService.getTask(taskId);
	}

	ngOnInit(): void {
		this.taskForm = this.formBuilder.group({
			title: new FormControl(this.task?.title ?? ''),
			description: new FormControl(this.task?.description ?? ''),
			status: new FormControl(this.task?.status ?? TaskStatus.Todo),
		});
	}
	protected submitTask(): void {
		const result = this.taskForm.value;

		if (this.task) {
			const editedTask: Task = {
				...this.task,
				title: result.title ?? this.task.title,
				description: result.description ?? this.task.description,
				status: result.status ?? this.task.status,
			};
			this.taskService
				.editTask(editedTask)
				.then(() => {
					this.navigateToTaskBoard();
				})
				.catch();
		} else {
			const addTask: CreateTask = {
				title: result.title ?? '',
				description: result.description ?? '',
				status: result.status ?? TaskStatus.Todo,
			};
			this.taskService
				.addTask(addTask)
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

	protected readonly Devices = Devices;
}
