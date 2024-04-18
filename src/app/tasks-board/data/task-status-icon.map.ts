import { TaskStatus, TaskStatusIcons } from '../models/task.model';

export const taskStatusIcon: TaskStatusIcons = new Map();
taskStatusIcon.set(TaskStatus.Todo, 'radio_button_unchecked');
taskStatusIcon.set(TaskStatus.Doing, 'playlist_add_circle');
taskStatusIcon.set(TaskStatus.Done, 'task_alt');
