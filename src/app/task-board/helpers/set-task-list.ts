import { computed, Signal } from '@angular/core';

import { Task } from '../models/task';
import { TaskStatus, TaskStatusList } from '../models/task-status';

export const setTaskStatusList = (taskList: Signal<Task[]>): TaskStatusList => {
	return {
		[TaskStatus.Todo]: filterTaskList(TaskStatus.Todo, taskList),
		[TaskStatus.Doing]: filterTaskList(TaskStatus.Doing, taskList),
		[TaskStatus.Done]: filterTaskList(TaskStatus.Done, taskList),
	};
};
const filterTaskList = (
	status: TaskStatus,
	taskList: Signal<Task[]>
): Signal<Task[]> => {
	return computed(() =>
		taskList()
			.filter((task: Task) => task.status === status)
			.sort((a: Task, b: Task) => a.index - b.index)
	);
};
