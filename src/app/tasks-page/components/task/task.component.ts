import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatCardModule } from '@angular/material/card'

import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  @Input()
  public task: Task | null = null

  @Output()
  public editTask = new EventEmitter<Task>();

  protected onEditTask(task: Task): void {

    this.editTask.emit(task)
  }

}
