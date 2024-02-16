import { Injectable } from '@angular/core';

import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private _todos: Task[] = [
    {
      title: 'Buy milk',
      description: 'Go to the store and buy milk'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular create a Kanban app!'
    }
  ]

  public get todos(): Task[] {
    return this._todos
  }
}
