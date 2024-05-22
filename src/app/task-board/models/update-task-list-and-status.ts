import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Task } from './task';
import { TaskStatus } from './task-status';

export type UpdateTaskListAndStatus = {
	taskDropped: CdkDragDrop<Task[]>;
	targetStatus?: TaskStatus;
};
