import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, getDocs, CollectionReference, DocumentReference, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';

import { CreateTask, Task, TaskStatus } from '../models/task.interface';

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
      const task = doc.data() as CreateTask
      const taskDto: Task = {
        ...task,
        id: doc.id
      }
      taskList.push(taskDto);
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

  public async deleteTask(deleteTask: Task) {
    this.taskList.update((taskList) => taskList.filter((task: Task) => task.id !== deleteTask.id));

    await deleteDoc(doc(this.firestore, this.collectionName, deleteTask.id));
  }


  public async addTask(task: CreateTask) {
    const docRef: DocumentReference = await addDoc(this.todosCollection, <CreateTask>task);
    const addTask: Task = {
      id: docRef.id,
      title: task.title,
      description: task.description,
      status: task.status,
    }

    this.taskList.update((taskList) => [...taskList, addTask]);
  }
}
