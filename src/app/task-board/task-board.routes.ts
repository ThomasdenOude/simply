import { Routes } from '@angular/router';

import { TaskBoardComponent } from './pages/task-board-page/task-board.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';

export const TASK_BOARD_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: TaskBoardComponent,
	},
	{
		path: 'task',
		component: EditTaskComponent,
	},
	{
		path: 'task/:id',
		component: EditTaskComponent,
	},
];
