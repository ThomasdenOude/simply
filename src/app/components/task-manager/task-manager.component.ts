import { Component, OnInit, Signal, WritableSignal, computed } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskService } from '../../services/task.service';
import { Task, TaskDialogResult, TaskStatus } from '../../models/task.interface';
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
  protected TaskStatus = TaskStatus;
  protected todo!: Signal<Task[]>;
  protected inProgress!: Signal<Task[]>;
  protected done!: Signal<Task[]>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.todo = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Todo));
    this.inProgress = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Inprogress));
    this.done = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Done))
  }

  protected editTask(taskStatus: TaskStatus, task: Task): void {

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {

      if (!result) {
        return;
      }
      if (result.delete) {
        this.taskService.deleteTask(task)
      } else if (result.editTask) {
        this.taskService.editTask(result.editTask)
      }
    });
  }

  protected newTask(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: null
      }
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult | null) => {

        if (!result) {
          return;
        }
        if (result.addTask) {
          this.taskService.addTask(result.addTask)
        }
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
