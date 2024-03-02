import { Component, OnInit, Signal, computed, inject } from '@angular/core';

import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop'
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { TaskService } from '../services/task.service';
import { Task, TaskDialogData, TaskStatus } from '../models/task.interface';
import { TaskComponent } from '../components/task/task.component';
import { TaskDialogComponent } from '../components/task-dialog/task-dialog.component'

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [DragDropModule, MatButtonModule, MatIconModule, TaskComponent, TaskDialogComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit {

  private taskService: TaskService = inject(TaskService);
  private dialog: MatDialog = inject(MatDialog);

  protected TaskStatus = TaskStatus;
  protected TODO!: Signal<Task[]>;
  protected INPROGRESS!: Signal<Task[]>;
  protected DONE!: Signal<Task[]>;

  ngOnInit(): void {
    const sortTasks = ((a: Task, b: Task) => a.index - b.index)
    this.TODO = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Todo).sort(sortTasks));
    this.INPROGRESS = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Inprogress).sort(sortTasks));
    this.DONE = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Done).sort(sortTasks));
  }

  protected editTask(task: Task): void {

    this.dialog.open<TaskDialogComponent, TaskDialogData, null>(TaskDialogComponent, {
      width: '270px',
      data: task,
    });
  }

  protected newTask(): void {
    this.dialog.open<TaskDialogComponent, TaskDialogData, null>(TaskDialogComponent, {
      width: '270px',
      data: null
    });

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
}
