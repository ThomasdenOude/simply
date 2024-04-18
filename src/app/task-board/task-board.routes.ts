import { Routes } from '@angular/router';

import { TaskBoardComponent } from './view/task-board-page/task-board.component';
import { TaskEditComponent } from './view/task-edit-page/task-edit.component';

export const TASK_BOARD_ROUTES: Routes = [
	{
		path: '',
		pathMatch: 'full',
		component: TaskBoardComponent,
	},
	{
		path: 'task',
		component: TaskEditComponent,
	},
	{
		path: 'task/:id',
		component: TaskEditComponent,
	},
];
