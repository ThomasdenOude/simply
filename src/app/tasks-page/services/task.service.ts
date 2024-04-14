import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import {
	Firestore,
	collection,
	addDoc,
	getDocs,
	CollectionReference,
	DocumentReference,
	deleteDoc,
	doc,
	updateDoc,
} from '@angular/fire/firestore';
import { User } from '@angular/fire/auth';

import { AuthenticationService } from '../../base/services/authentication.service';
import {
	CreateTask,
	Task,
	TaskDto,
	TaskStatus,
} from '../models/task.interface';

@Injectable({
	providedIn: 'root',
})
export class TaskService {
	private firestore: Firestore = inject(Firestore);
	private authService: AuthenticationService = inject(AuthenticationService);

	public taskList: WritableSignal<Task[]> = signal([]);

	constructor() {
		this.initTasks();
	}

	private get user(): User | null {
		return this.authService.user();
	}

	private get collectionName(): string | null {
		const userUid: string | null = this.user?.uid ?? null;

		return userUid ? `${userUid}` : null;
	}

	private getCollection(): CollectionReference | null {
		const collectionName: string | null = this.collectionName;

		return collectionName ? collection(this.firestore, collectionName) : null;
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
			this.taskList.set(taskList);
		}
	}

	public async addTask(task: CreateTask) {
		const collection: CollectionReference | null = this.getCollection();
		if (collection) {
			const totalTodos: number = this.taskList().filter(
				task => task.status === TaskStatus.Todo
			).length;

			const taskDto: TaskDto = {
				...task,
				index: totalTodos,
			};
			const docRef: DocumentReference = await addDoc(
				collection,
				<TaskDto>taskDto
			);

			const addTask: Task = {
				...taskDto,
				id: docRef.id,
			};

			this.taskList.update(taskList => [...taskList, addTask]);
		}
	}

	public async editTask(editTask: Task) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			this.taskList.update(taskList => {
				const index = taskList.findIndex(
					(task: Task) => task.id === editTask.id
				);
				if (index > -1) {
					taskList[index] = { ...editTask };
				}
				return [...taskList];
			});
			await updateDoc(doc(this.firestore, collectionName, editTask.id), {
				title: editTask.title,
				description: editTask.description,
				status: editTask.status,
			});
		}
	}

	public async deleteTask(deleteTask: Task) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			this.taskList.update(taskList =>
				taskList.filter((task: Task) => task.id !== deleteTask.id)
			);

			await deleteDoc(doc(this.firestore, collectionName, deleteTask.id));
		}
	}

	public updateIndex(status: TaskStatus, newList: Task[]) {
		const collectionName: string | null = this.collectionName;
		if (collectionName) {
			newList.forEach((task: Task, index: number) => {
				this.postIndex(task.id, index, collectionName);
				task.index = index;
			});
			this.taskList.update(list => {
				const otherStatusses: Task[] = list.filter(
					task => task.status !== status
				);

				return [...otherStatusses, ...newList];
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
				(task.status = currentStatus), (task.index = index);
			});
			previousList.forEach((task: Task, index: number) => {
				this.postIndex(task.id, index, collectionName);
				task.index = index;
			});
			this.taskList.update(list => {
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
		await updateDoc(doc(this.firestore, collectionName, taskId), {
			index: newIndex,
		});
	}

	private async postIndexAndStatus(
		taskId: string,
		newIndex: number,
		newStatus: TaskStatus,
		collectionName: string
	) {
		await updateDoc(doc(this.firestore, collectionName, taskId), {
			index: newIndex,
			status: newStatus,
		});
	}
}
