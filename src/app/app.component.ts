import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'

import { TaskService } from './services/task.service';
import { TaskComponent } from './components/task/task.component'
import { Task } from './models/task.interface'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatIconModule, TaskComponent, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected todos!: Task[];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.todos = this.taskService.todos
  }
}
