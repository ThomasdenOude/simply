import { Component, Input, OnChanges, Signal, SimpleChanges, computed, inject } from '@angular/core';
import { LowerCasePipe } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';

import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { TaskStatus, Task, TaskDialogData } from '../../models/task.interface';
import { TaskService } from '../../services/task.service';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-task-column',
  standalone: true,
  imports: [DragDropModule, LowerCasePipe, TaskComponent],
  templateUrl: './task-column.component.html',
  styleUrl: './task-column.component.scss'
})
export class TaskColumnComponent implements OnChanges {
  private taskService = inject(TaskService);
  private dialog = inject(MatDialog);
  private taskStatusList: TaskStatus[] = Object.values(TaskStatus);
  protected connectedList!: TaskStatus[];
  protected taskList!: Signal<Task[]>

  @Input() taskStatus!: TaskStatus

  ngOnChanges(changes: SimpleChanges): void {
    const newTaskStatus: TaskStatus = changes['taskStatus'].currentValue;
    const previousTaskStatus: TaskStatus = changes['taskStatu']?.previousValue
    if (newTaskStatus !== previousTaskStatus) {
      this.connectedList = this.taskStatusList.filter(status => status !== newTaskStatus);
      this.taskList = computed(
        () => this.taskService.taskList()
          .filter((task: Task) => task.status === newTaskStatus)
          .sort((a: Task, b: Task) => a.index - b.index)
      );
    }
  }

  protected updateTask(event: CdkDragDrop<Task[]>): void {

    const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
    const previousList: Task[] = event.previousContainer.data
    const previousIndex: number = event.previousIndex;

    const currentStatus: TaskStatus = event.container.id as TaskStatus;
    const currentList: Task[] = event.container.data;
    const currentIndex: number = event.currentIndex;

    if (event.container === event.previousContainer) {
      moveItemInArray(
        currentList,
        previousIndex,
        currentIndex
      )
      this.taskService.updateIndex(currentStatus, currentList)
    } else {
      transferArrayItem(
        previousList,
        currentList,
        previousIndex,
        currentIndex
      )
      this.taskService.updateIndexAndStatus(previousStatus, previousList, currentStatus, currentList)
    }
  }

  protected editTask(task: Task): void {

    this.dialog.open<TaskDialogComponent, TaskDialogData, null>(TaskDialogComponent, {
      width: '270px',
      data: task,
    });
  }
}
