import {
	Component,
	EventEmitter,
	Input,
	InputSignal,
	Output,
	input,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';

import { Task } from '../../models/task.interface';

@Component({
	selector: 'app-task',
	standalone: true,
	imports: [MatCardModule],
	templateUrl: './task.component.html',
	styleUrl: './task.component.scss',
})
export class TaskComponent {
	public task: InputSignal<Task> = input.required<Task>();

	@Output()
	public editTask = new EventEmitter<Task>();

	protected onEditTask(): void {
		this.editTask.emit(this.task());
	}
}
