import { FormControl, FormGroup } from "@angular/forms";

export interface Task extends TaskDto {
    id: string;
}

export interface TaskDto extends CreateTask {
    index: number;
}

export interface CreateTask {
    title: string;
    description: string;
    status: TaskStatus;
}

export type CreateTaskFormgroup = FormGroup<{
    [Key in keyof CreateTask]: FormControl<CreateTask[Key] | null>
}>

export type TaskDialogData = Task | null;


export enum TaskStatus {
    Todo = "TODO",
    Inprogress = "INPROGRESS",
    Done = "DONE"
}
