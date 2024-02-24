import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { MatInputModule } from '@angular/material/input'
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'
import { TaskDialogData, TaskDialogResult, TaskStatus } from '../../models/task.interface';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [FormsModule, MatInputModule, MatDialogModule, MatIconModule],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit {
  protected title = '';
  protected description = ''

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) { }

  ngOnInit(): void {
    if (this.data.task) {
      this.title = this.data.task.title
      this.description = this.data.task.description
    }
  }
  protected submitTask(): void {
    const result: TaskDialogResult = {}

    if (this.data.task) {
      result.editTask = {
        ...this.data.task,
        title: this.title,
        description: this.description
      }
    } else {
      result.addTask = {
        title: this.title,
        description: this.description,
        status: TaskStatus.Todo,
      }
    }
    this.dialogRef.close(result)
  }

  protected deleteTask(): void {
    if (this.data.task) {
      const result: TaskDialogResult = {
        editTask: this.data.task,
        delete: true
      }
      this.dialogRef.close(result);
    }
  }

  protected cancel(): void {
    this.dialogRef.close(null);
  }

}
