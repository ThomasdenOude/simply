import { TaskStatus } from '../models/task-status';

export const TASK_STATUS_LIST: ReadonlyArray<TaskStatus> =
	Object.values(TaskStatus);
