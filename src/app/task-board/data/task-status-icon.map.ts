import { TaskStatus, TaskStatusIcons } from '../models/task-status';

export const todoIconText = 'radio_button_unchecked';
export const taskStatusIcon: TaskStatusIcons = new Map<TaskStatus, string>();
taskStatusIcon.set(TaskStatus.Todo, todoIconText);
taskStatusIcon.set(TaskStatus.Doing, 'playlist_add_circle');
taskStatusIcon.set(TaskStatus.Done, 'task_alt');
