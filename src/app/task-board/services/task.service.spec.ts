import { signal } from '@angular/core';

import { User } from '@angular/fire/auth';
import {
	CollectionReference,
	DocumentReference,
	Firestore,
	DocumentData,
	QuerySnapshot,
} from '@angular/fire/firestore';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';

import { TaskService } from './task.service';
import { AuthenticationService } from '../../account/services/authentication-service/authentication.service';
import { TaskStatus } from '../models/task-status';
import { CreateTask, Task } from '../models/task';
import { getMockedTaskList } from '../test/mocked-data/mocked-task-list';
import {
	mockAddDoc,
	mockCollection,
	mockDeleteDoc,
	mockDoc,
	mockGetDocs,
	mockUpdateDoc,
} from './mock-firestore-functions';

jest.mock('@angular/fire/firestore');

describe('TaskService', () => {
	let fixture: MockedComponentFixture<TaskService>;
	let service: TaskService;
	const mockTaskList: Task[] = getMockedTaskList();
	const mockUid = 'mock-uid';
	const mockUser: MockProxy<User> = mock<User>({
		uid: mockUid,
	});
	const mockCollectionReference: MockProxy<CollectionReference<DocumentData>> =
		mock<CollectionReference<DocumentData>>();
	const mockDocumentReference: MockProxy<DocumentReference<DocumentData>> =
		mock<DocumentReference<DocumentData>>();

	const mockQuerySnapshot: MockProxy<QuerySnapshot<DocumentData>> =
		mock<QuerySnapshot<DocumentData>>();

	beforeEach(() =>
		MockBuilder(TaskService, [Firestore, AuthenticationService]).mock(
			AuthenticationService,
			{
				user: signal(mockUser),
			}
		)
	);

	beforeEach(() => {
		fixture = MockRender(TaskService);
		service = fixture.point.componentInstance;
		mockCollection.mockReturnValue(mockCollectionReference);
		mockDoc.mockReturnValue(mockDocumentReference);
		mockGetDocs.mockReturnValue(Promise.resolve(mockQuerySnapshot));
	});

	it('returns task list and active list', () => {
		// Asset
		expect(service.taskList().length).toBe(0);
		expect(service.activeList()).toBe(TaskStatus.Todo);
		expect(service.editDoneId()).toBe(null);
	});

	it('sets active list', () => {
		// Act
		service.setActiveList(TaskStatus.Done);
		// Assert
		expect(service.activeList()).toBe(TaskStatus.Done);
	});

	it('sets edit task done Id', () => {
		// Act
		service.setEditTaskDone(mockTaskList[1]);
		// Assert
		expect(service.editDoneId()).toBe(mockTaskList[1].id);
	});

	it('adds a new task', () => {
		// Arrange
		const mockAddedTask = mockTaskList[0];
		const mockCreatedTask: CreateTask = {
			title: mockAddedTask.title,
			description: mockAddedTask.description,
			status: mockAddedTask.status,
		};
		const mockDocRef = mock<DocumentReference<DocumentData>>({
			id: mockAddedTask.id,
		});
		mockAddDoc.mockReturnValueOnce(Promise.resolve(mockDocRef));
		mockUpdateDoc.mockReturnValue(Promise.resolve());
		// Act
		service.addTask(mockCreatedTask);
		// Assert
		expect(mockAddDoc).toHaveBeenCalledTimes(1);
		expect(mockAddDoc).toHaveBeenCalledWith(mockCollectionReference, {
			...mockCreatedTask,
			index: 0,
		});
	});

	it('deletes a  task', () => {
		// Arrange
		const mockDeleteTask = mockTaskList[0];
		// Act
		service.deleteTask(mockDeleteTask);
		// Assert
		expect(mockDeleteDoc).toHaveBeenCalledTimes(1);
	});
});
