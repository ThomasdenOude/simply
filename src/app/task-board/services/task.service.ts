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

import { AuthenticationService } from '../../user-management/services/authentication.service';
import { CreateTask, Task, TaskDto, TaskStatus } from '../models/task.model';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private _firestore: Firestore = inject(Firestore);
	private _authService: AuthenticationService = inject(AuthenticationService);
	private _taskList: WritableSignal<Task[]> = signal([]);

	private _activeList: WritableSignal<TaskStatus> = signal(TaskStatus.Todo);

	constructor() {
		this.initTasks();
	}

	public readonly taskList: Signal<Task[]> = computed(() => this._taskList());

	public readonly activeList: Signal<TaskStatus> = computed(() =>
		this._activeList()
	);

	public setActiveList(status: TaskStatus): void {
		this._activeList.set(status);
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
			const totalTodos: number = this._taskList().filter(
				task => task.status === TaskStatus.Todo
			).length;

			const taskDto: TaskDto = {
				index: totalTodos,
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

			this._taskList.update(taskList => [...taskList, addTask]);
		}
	}

	public async editTask(editTask: Task) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			this._taskList.update(taskList => {
				const index = taskList.findIndex(
					(task: Task) => task.id === editTask.id
				);
				if (index > -1) {
					taskList[index] = { ...editTask };
				}
				return [...taskList];
			});
			await updateDoc(doc(this._firestore, collectionName, editTask.id), {
				title: editTask.title,
				description: editTask.description,
				status: editTask.status,
			});
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

	public updateIndex(status: TaskStatus, newList: Task[]) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			newList.forEach((task: Task, index: number) => {
				this.postIndex(task.id, index, collectionName);
				task.index = index;
			});
			this._taskList.update(list => {
				const otherStatuses: Task[] = list.filter(
					task => task.status !== status
				);

				return [...otherStatuses, ...newList];
			});
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
				const otherStatus = list.filter(
					task =>
						task.status !== previousStatus && task.status !== currentStatus
				);

				return [...otherStatus, ...previousList, ...currentList];
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
