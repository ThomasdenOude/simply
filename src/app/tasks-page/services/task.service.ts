import { Injectable, WritableSignal, inject, signal } from '@angular/core';

import { Firestore, collection, addDoc, getDocs, CollectionReference, DocumentReference, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

import { CreateTask, Task, TaskDto, TaskStatus } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore: Firestore = inject(Firestore);
  private readonly collectionName = 'todos'
  private todosCollection: CollectionReference = collection(this.firestore, this.collectionName);

  public taskList: WritableSignal<Task[]> = signal([])

  constructor() {
    this.initTasks()
  }

  private async initTasks() {
    const todosSnapshot = await getDocs(this.todosCollection);
    let taskList: Task[] = [];

    todosSnapshot.forEach(doc => {
      const taskDto = doc.data() as TaskDto
      const task: Task = {
        ...taskDto,
        id: doc.id,
      }
      taskList.push(task);
    });
    this.taskList.set(taskList);
  }

  public async editTask(editTask: Task) {

    this.taskList.update((taskList) => {

      const index = taskList.findIndex((task: Task) => task.id === editTask.id);
      if (index > -1) {
        taskList[index] = { ...editTask }
      }
      return [...taskList];
    })
    await updateDoc(doc(this.firestore, this.collectionName, editTask.id), {
      title: editTask.title,
      description: editTask.description,
      status: editTask.status
    })
  }

  public updateIndex(
    status: TaskStatus,
    newList: Task[]
  ) {
    newList.forEach((task: Task, index: number) => {
      this.postIndex(task.id, index)
      task.index = index;
    })
    this.taskList.update(list => {
      const otherStatusses: Task[] = list.filter(task => task.status !== status)

      return [...otherStatusses, ...newList]
    })
  }

  public updateIndexAndStatus(
    previousStatus: TaskStatus,
    previousList: Task[],
    currentStatus: TaskStatus,
    currentList: Task[]
  ) {
    currentList.forEach((task: Task, index: number) => {
      this.postIndexAndStatus(task.id, index, currentStatus);
      task.status = currentStatus,
        task.index = index
    })
    previousList.forEach((task: Task, index: number) => {
      this.postIndex(task.id, index);
      task.index = index;
    })
    this.taskList.update(list => {
      const otherStatus = list.filter(task => task.status !== previousStatus && task.status !== currentStatus)

      return [...otherStatus, ...previousList, ...currentList]
    })
  }

  private async postIndex(taskId: string, newIndex: number) {
    await updateDoc(doc(this.firestore, this.collectionName, taskId), {
      index: newIndex
    })
  }

  private async postIndexAndStatus(taskId: string, newIndex: number, newStatus: TaskStatus) {
    await updateDoc(doc(this.firestore, this.collectionName, taskId), {
      index: newIndex,
      status: newStatus
    })
  }

  public async deleteTask(deleteTask: Task) {
    this.taskList.update((taskList) => taskList.filter((task: Task) => task.id !== deleteTask.id));

    await deleteDoc(doc(this.firestore, this.collectionName, deleteTask.id));
  }


  public async addTask(task: CreateTask) {

    const totalTodos: number = this.taskList().filter(task => task.status === TaskStatus.Todo).length

    const taskDto: TaskDto = {
      ...task,
      index: totalTodos
    }
    const docRef: DocumentReference = await addDoc(this.todosCollection, <TaskDto>taskDto);

    const addTask: Task = {
      ...taskDto,
      id: docRef.id,
    }

    this.taskList.update((taskList) => [...taskList, addTask]);
  }
}
