import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskService } from '../../services/task.service';
import { Task, TaskDialogResult } from '../../models/task.interface';
import { TaskComponent } from '../task/task.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component'

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [NgIf, NgFor, DragDropModule, MatButtonModule, MatIconModule, TaskComponent, TaskDialogComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit {
  protected todo!: Task[];
  protected inProgress: Task[] = [];
  protected done: Task[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.todo = this.taskService.todos
  }

  protected editTask(list: string, task: Task): void { }

  protected newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | undefined) => {
        if (!result) {
          return;
        }
        this.todo.push(result.task);
      });
  }


  protected drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      return;
    }
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }


}
