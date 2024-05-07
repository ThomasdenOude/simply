import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { Task, TaskStatus } from './task.model';

export type UpdateTaskAndStatus = {
	taskDropped: CdkDragDrop<Task[]>;
	targetStatus?: TaskStatus;
};
