import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { MatInputModule } from '@angular/material/input'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Task, TaskDialogData } from '../../models/task.interface';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatDialogModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent {
  private backupTask: Partial<Task> = { ...this.data.task };

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { }

  cancel(): void {
    this.data.task.title = this.backupTask.title;
    this.data.task.description = this.backupTask.description;
    this.dialogRef.close(this.data);
  }

}
