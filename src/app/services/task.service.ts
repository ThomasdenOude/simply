import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference } from '@angular/fire/firestore';

import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private firestore: Firestore = inject(Firestore);
  private todosCollection: CollectionReference = collection(this.firestore, 'todos');
  private _todos$: Observable<Task[]>;

  constructor() {
    this._todos$ = collectionData(this.todosCollection) as Observable<Task[]>
  }

  public get todos(): Task[] {
    return [
      {
        title: 'Do',
        description: 'Really, you have to'
      },
      {
        title: 'Do not',
        description: 'It is just an option'
      }
    ]
  }

  public addTodo(task: Task): void {
    addDoc(this.todosCollection, <Task>task).then((documentReference: DocumentReference) => {
      console.log(documentReference);

    })
  }
}
