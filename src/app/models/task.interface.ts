export interface Task extends CreateTask {
    id: string,
}

export interface CreateTask {
    title: string;
    description: string;
    status: TaskStatus
}

export interface TaskDialogData {
    task: Task | null;
    enableDelete: boolean;
}

export interface TaskDialogResult {
    editTask?: Task;
    addTask?: CreateTask;
    delete?: boolean;
}

export enum TaskStatus {
    Todo = "TODO",
    Inprogress = "INPROGRESS",
    Done = "DONE"
}
