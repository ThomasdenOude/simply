import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Task, TaskStatus } from './task.model';

export type UpdateTaskListAndStatus = {
	taskDropped: CdkDragDrop<Task[]>;
	targetStatus?: TaskStatus;
};
