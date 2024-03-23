import { FormControl, FormGroup } from '@angular/forms';

export interface Task extends TaskDto {
	id: string;
}

export interface TaskDto extends CreateTask {
	index: number;
}

export interface CreateTask {
	title: string;
	description: string;
	status: TaskStatus;
}

export type CreateTaskFormGroup = FormGroup<{
	[Key in keyof CreateTask]: FormControl<CreateTask[Key] | null>;
}>;

export type TaskDialogData = Task | null;

export enum TaskStatus {
	Todo = 'TODO',
	Doing = 'DOING',
	Done = 'DONE',
}

export interface UpdateTaskIndex {
	currentStatus: TaskStatus;
	currentList: Task[];
}

export interface UpdateTaskIndexAndStatus extends UpdateTaskIndex {
	previousStatus: TaskStatus;
	previousList: Task[];
}
