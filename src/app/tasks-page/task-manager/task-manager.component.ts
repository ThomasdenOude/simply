import { Component, OnInit, Signal, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskDialogData, TaskStatus, Task } from '../models/task.interface';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component'
import { MatCardModule } from '@angular/material/card';
import { TaskColumnComponent } from '../components/task-column/task-column.component';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, TaskDialogComponent, TaskColumnComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit {
  private taskService: TaskService = inject(TaskService);
  private dialog: MatDialog = inject(MatDialog);

  protected taskList!: Signal<Task[]>;
  protected TaskStatus = TaskStatus;

  ngOnInit(): void {
    this.taskList = this.taskService.taskList;
  }

  protected editTask(task?: Task) {

    this.dialog.open<TaskDialogComponent, TaskDialogData, null>(TaskDialogComponent, {
      data: task ?? null,
    });
  }
}
