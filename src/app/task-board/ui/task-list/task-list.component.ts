import { Component, input, InputSignal } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';

import { TaskStatus } from '../../models/task.model';
import { taskStatusIcon } from '../../data/task-status-icon.map';

@Component({
	selector: 'app-task-list',
	standalone: true,
	imports: [MatIconModule],
	templateUrl: './task-list.component.html',
	styleUrl: './task-list.component.scss',
})
export class TaskListComponent {
	public taskStatus: InputSignal<TaskStatus> = input.required<TaskStatus>();
	protected readonly taskStatusIcon = taskStatusIcon;
}
