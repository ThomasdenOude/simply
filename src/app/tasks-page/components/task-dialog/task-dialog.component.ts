import { Component, OnInit, inject } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import {
	MatDialogModule,
	MatDialogRef,
	MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Task } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';
import {
	CreateTask,
	CreateTaskFormGroup,
	TaskDialogData,
	TaskStatus,
} from '../../models/task.interface';

@Component({
	selector: 'app-task-dialog',
	standalone: true,
	imports: [
		FormsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatDialogModule,
		MatIconModule,
		MatFormFieldModule,
		MatButtonModule,
		MatTooltipModule,
	],
	templateUrl: './task-dialog.component.html',
	styleUrl: './task-dialog.component.scss',
})
export class TaskDialogComponent implements OnInit {
	private taskService: TaskService = inject(TaskService);
	private taskData: TaskDialogData = inject(MAT_DIALOG_DATA);
	private dialogRef: MatDialogRef<TaskDialogComponent, null> =
		inject(MatDialogRef);
	private formBuilder: FormBuilder = new FormBuilder();

	protected taskForm!: CreateTaskFormGroup;
	protected isEditTask: boolean = !!this.taskData;

	ngOnInit(): void {
		this.taskForm = this.formBuilder.group({
			title: new FormControl(this.taskData?.title ?? ''),
			description: new FormControl(this.taskData?.description ?? ''),
			status: new FormControl(this.taskData?.status ?? TaskStatus.Todo),
		});
	}
	protected submitTask(): void {
		const result = this.taskForm.value;

		if (this.taskData) {
			const editedTask: Task = {
				...this.taskData,
				title: result.title ?? this.taskData.title,
				description: result.description ?? this.taskData.description,
				status: result.status ?? this.taskData.status,
			};
			this.taskService.editTask(editedTask);
		} else {
			const addTask: CreateTask = {
				title: result.title ?? '',
				description: result.description ?? '',
				status: result.status ?? TaskStatus.Todo,
			};
			this.taskService.addTask(addTask);
		}
		this.dialogRef.close(null);
	}

	protected deleteTask(): void {
		if (this.taskData) {
			this.taskService.deleteTask(this.taskData);
		}
		this.dialogRef.close(null);
	}

	protected cancel(): void {
		this.dialogRef.close(null);
	}
}
