import { Signal } from '@angular/core';
import { Task } from './task';

export enum TaskStatus {
	Todo = 'TODO',
	Doing = 'DOING',
	Done = 'DONE',
}

export enum TabTaskStatus {
	TabTodo = 'TAB_TODO',
	TabDoing = 'TAB_DOING',
	TabDone = 'TAB_DONE',
}

export type TaskStatusList = {
	[key in TaskStatus]: Signal<Task[]>;
};
export type TaskStatusIcons = Map<TaskStatus, string>;
