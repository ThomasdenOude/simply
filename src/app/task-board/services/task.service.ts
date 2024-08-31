import {
	computed,
	inject,
	Injectable,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';

import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentReference,
	Firestore,
	getDocs,
	updateDoc,
} from '@angular/fire/firestore';

import { AuthenticationService } from '../../account/services/authentication-service/authentication.service';
import { CreateTask, Task, TaskDto } from '../models/task';
import { TaskStatus } from '../models/task-status';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private _firestore: Firestore = inject(Firestore);
	private _authService: AuthenticationService = inject(AuthenticationService);

	private _taskList: WritableSignal<Task[]> = signal([]);
	private _activeList: WritableSignal<TaskStatus> = signal(TaskStatus.Todo);
	private _editDoneId: WritableSignal<string | null> = signal(null);

	public readonly taskList: Signal<Task[]> = computed(() => this._taskList());
	public readonly activeList: Signal<TaskStatus> = computed(() =>
		this._activeList()
	);
	public readonly editDoneId: Signal<string | null> = computed(() => {
		return this._editDoneId();
	});

	constructor() {
		this.initTasks();
	}

	public setActiveList(status: TaskStatus): void {
		this._activeList.set(status);
	}

	public setEditTaskDone(task: Task): void {
		this._editDoneId.set(task.id);
	}

	private get collectionName(): string | null {
		const userUid: string | null = this._authService.user()?.uid ?? null;

		return userUid ? `${userUid}` : null;
	}

	private getCollection(): CollectionReference | null {
		const collectionName: string | null = this.collectionName;

		return collectionName ? collection(this._firestore, collectionName) : null;
	}

	private async initTasks() {
		const collection: CollectionReference | null = this.getCollection();
		if (collection) {
			const todosSnapshot = await getDocs(collection);
			let taskList: Task[] = [];

			todosSnapshot.forEach(doc => {
				const taskDto = doc.data() as TaskDto;
				const task: Task = {
					...taskDto,
					id: doc.id,
				};
				taskList.push(task);
			});
			this._taskList.set(taskList);
		}
	}

	public getTask(id: string): Task | undefined {
		return this._taskList().find((task: Task) => task.id === id);
	}

	public async addTask(task: CreateTask) {
		const collection: CollectionReference | null = this.getCollection();
		if (collection) {
			const taskDto: TaskDto = {
				index: 0,
				title: task.title ?? '',
				description: task.description ?? '',
				status: task.status ?? TaskStatus.Todo,
			};
			const docRef: DocumentReference = await addDoc(
				collection,
				<TaskDto>taskDto
			);

			const addTask: Task = {
				...taskDto,
				id: docRef.id,
			};
			const collectionName: string | null = this.collectionName;
			if (collectionName) {
				await updateDoc(doc(this._firestore, collectionName, addTask.id), {
					id: addTask.id,
				});
			}
			this.toTopOfList(addTask, [...this.taskList(), addTask]);

			this.setEditTaskDone(addTask);
		}
	}

	public async editTask(editTask: Task) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			await updateDoc(doc(this._firestore, collectionName, editTask.id), {
				title: editTask.title,
				description: editTask.description,
				status: editTask.status,
			});

			const taskList: Task[] = this.taskList();
			const index: number = taskList.findIndex(
				(task: Task) => task.id === editTask.id
			);
			if (index > -1) {
				const statusChange: boolean =
					taskList[index].status !== editTask.status;
				taskList[index] = { ...editTask };
				if (statusChange) {
					this.toTopOfList(editTask, taskList);
				} else {
					this._taskList.set([...taskList]);
				}
			}

			this.setEditTaskDone(editTask);
		}
	}

	public async deleteTask(deleteTask: Task) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			this._taskList.update(taskList =>
				taskList.filter((task: Task) => task.id !== deleteTask.id)
			);

			await deleteDoc(doc(this._firestore, collectionName, deleteTask.id));
		}
	}

	private toTopOfList(editedTask: Task, taskList: Task[]): void {
		const updatedStatusList: Task[] = taskList
			.filter(task => task.status === editedTask.status)
			.map(task => {
				if (task.id === editedTask.id) {
					task.index = 0;
				} else {
					task.index++;
				}
				return task;
			});
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			updatedStatusList.forEach(task => {
				this.postIndex(task.id, task.index, collectionName);
			});
		}
		this.partialTaskListUpdate(editedTask.status, updatedStatusList);
	}

	private partialTaskListUpdate(status: TaskStatus, taskStatusList: Task[]) {
		this._taskList.update(list => {
			const otherStatusList: Task[] = list.filter(
				task => task.status !== status
			);

			return [...otherStatusList, ...taskStatusList];
		});
	}

	public updateIndex(status: TaskStatus, taskStatusList: Task[]) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			taskStatusList.forEach((task: Task, index: number) => {
				this.postIndex(task.id, index, collectionName);
				task.index = index;
			});
			this.partialTaskListUpdate(status, taskStatusList);
		}
	}

	public updateIndexAndStatus(
		previousStatus: TaskStatus,
		previousList: Task[],
		currentStatus: TaskStatus,
		currentList: Task[]
	) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			currentList.forEach((task: Task, index: number) => {
				this.postIndexAndStatus(task.id, index, currentStatus, collectionName);
				task.status = currentStatus;
				task.index = index;
			});
			previousList.forEach((task: Task, index: number) => {
				this.postIndex(task.id, index, collectionName);
				task.index = index;
			});
			this._taskList.update(list => {
				const otherStatusList = list.filter(
					task =>
						task.status !== previousStatus && task.status !== currentStatus
				);

				return [...otherStatusList, ...previousList, ...currentList];
			});
		}
	}

	private async postIndex(
		taskId: string,
		newIndex: number,
		collectionName: string
	) {
		await updateDoc(doc(this._firestore, collectionName, taskId), {
			index: newIndex,
		});
	}

	private async postIndexAndStatus(
		taskId: string,
		newIndex: number,
		newStatus: TaskStatus,
		collectionName: string
	) {
		await updateDoc(doc(this._firestore, collectionName, taskId), {
			index: newIndex,
			status: newStatus,
		});
	}
}
