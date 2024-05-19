import { TabTaskStatus, TaskStatus } from '../models/task-status';

const toTabStatusMap: Map<TaskStatus, TabTaskStatus> = new Map<
	TaskStatus,
	TabTaskStatus
>();

toTabStatusMap.set(TaskStatus.Todo, TabTaskStatus.TabTodo);
toTabStatusMap.set(TaskStatus.Doing, TabTaskStatus.TabDoing);
toTabStatusMap.set(TaskStatus.Done, TabTaskStatus.TabDone);

export const toTabStatus = (taskStatus: TaskStatus): TabTaskStatus => {
	return toTabStatusMap.get(taskStatus) ?? TabTaskStatus.TabTodo;
};
