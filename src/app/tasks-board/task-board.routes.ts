import { Routes } from '@angular/router';

import { TaskBoardComponent } from './view/task-board-page/task-board.component';
import { TaskEditComponent } from './ui/task-edit/task-edit.component';

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
];
