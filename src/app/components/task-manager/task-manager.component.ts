import { Component, OnInit, Signal, computed } from '@angular/core';

import { DragDropModule, CdkDragDrop, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop'
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
  imports: [DragDropModule, MatButtonModule, MatIconModule, TaskComponent, TaskDialogComponent],
  templateUrl: './task-manager.component.html',
  styleUrl: './task-manager.component.scss'
})
export class TaskManagerComponent implements OnInit {
  protected TaskStatus = TaskStatus;
  protected TODO!: Signal<Task[]>;
  protected INPROGRESS!: Signal<Task[]>;
  protected DONE!: Signal<Task[]>;

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    const sortTasks = ((a: Task, b: Task) => a.index - b.index)
    this.TODO = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Todo).sort(sortTasks));
    this.INPROGRESS = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Inprogress).sort(sortTasks));
    this.DONE = computed(() => this.taskService.taskList().filter((task: Task) => task.status === TaskStatus.Done).sort(sortTasks));
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

  protected updateTask(event: CdkDragDrop<Task[]>): void {

    const previousStatus: TaskStatus = event.previousContainer.id as TaskStatus;
    const previousList: Task[] = event.previousContainer.data
    const previousIndex: number = event.previousIndex;

    const currentStatus: TaskStatus = event.container.id as TaskStatus;
    const currentList: Task[] = event.container.data;
    const currentIndex: number = event.currentIndex;

    debugger

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
