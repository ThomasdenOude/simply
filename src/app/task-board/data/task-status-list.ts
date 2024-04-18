import { TaskStatus } from '../models/task.model';

export const TASK_STATUS_LIST: ReadonlyArray<TaskStatus> =
	Object.values(TaskStatus);
