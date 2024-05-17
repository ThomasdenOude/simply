import { BaseForm } from '../../base/models/base-form.model';
import { Signal } from '@angular/core';

export type Task = TaskDto & {
	id: string;
};

export type TaskDto = {
	index: number;
	title: string;
	description: string;
	status: TaskStatus;
};

export type CreateTask = {
	title: string | null;
	description: string | null;
	status: TaskStatus | null;
};

export type CreateTaskForm = BaseForm<CreateTask>;

export enum TaskStatus {
	Todo = 'TODO',
	Doing = 'DOING',
	Done = 'DONE',
}

export type TaskStatusList = {
	[key in TaskStatus]: Signal<Task[]>;
};

export type TaskStatusIcons = Map<TaskStatus, string>;
