import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskDialogData, TaskStatus } from '../models/task.interface';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component'
import { MatCardModule } from '@angular/material/card';
import { TaskColumnComponent } from '../components/task-column/task-column.component';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, TaskDialogComponent, TaskColumnComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent {

  private dialog: MatDialog = inject(MatDialog);
  protected TaskStatus = TaskStatus;

  protected newTask(): void {
    this.dialog.open<TaskDialogComponent, TaskDialogData, null>(TaskDialogComponent, {
      width: '270px',
      data: null
    });
  }
}
