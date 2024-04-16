import { FormControl, FormGroup } from '@angular/forms';

export type Task = TaskDto & {
	id: string;
};

export type TaskDto = CreateTask & {
	index: number;
};

export type CreateTask = {
	title: string;
	description: string;
	status: TaskStatus;
};

export type CreateTaskFormGroup = FormGroup<{
	[Key in keyof CreateTask]: FormControl<CreateTask[Key] | null>;
}>;

export type TaskDialogData = Task | null;

export enum TaskStatus {
	Todo = 'TODO',
	Doing = 'DOING',
	Done = 'DONE',
}

export type UpdateTaskIndex = {
	currentStatus: TaskStatus;
	currentList: Task[];
};

export type UpdateTaskIndexAndStatus = UpdateTaskIndex & {
	previousStatus: TaskStatus;
	previousList: Task[];
};
