import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockBuilder, MockedDebugElement, MockRender, ngMocks } from 'ng-mocks';

import { ResponsiveServiceMock } from '../../../base/services/responsive.service.mock';
import { RouterMock } from '../../../../test/mocks/router.mock';
import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';
import { TestParams } from '../../../../test/models/test-params.model';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { EditTaskComponent } from './edit-task.component';
import { TaskService } from '../../services/task.service';
import { CreateTask, Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TASK_BOARD_ROUTE } from '../../../base/guards/auth-guards';

describe('EditTaskComponent', () => {
	let taskService: TaskService;
	let router: Router;

	let taskTitleInput: MockedDebugElement;
	let taskDescriptionInput: MockedDebugElement;

	let deleteButton: MockedDebugElement;
	let cancelButton: MockedDebugElement;
	let saveButton: MockedDebugElement;

	const mockActiveStatus: TaskStatus = TaskStatus.Doing;

	const getElements = () => {
		taskTitleInput = dataTest('task-title-input');
		taskDescriptionInput = dataTest('task-description-input');
		saveButton = dataTest('save-button');
	};

	const mockResponsiveService = new ResponsiveServiceMock();
	const mockRouter = new RouterMock();
	const mockTask: Task = {
		id: 'one',
		index: 5,
		title: 'First thing',
		description: 'Start with this task first',
		status: TaskStatus.Doing,
	};

	beforeEach(() =>
		MockBuilder(EditTaskComponent, [ResponsiveService, Router, TaskService])
			.mock(Router, mockRouter)
			.mock(ResponsiveService, mockResponsiveService)
			.mock(TaskService, {
				getTask: jest.fn(() => mockTask),
				addTask: jest.fn(() => Promise.resolve()),
				editTask: jest.fn(() => Promise.resolve()),
				deleteTask: jest.fn(() => Promise.resolve()),
				activeList: signal(mockActiveStatus),
				setActiveList: jest.fn(),
			})
	);

	describe('New task', () => {
		beforeEach(() => {
			// Arrange
			MockRender(EditTaskComponent);
			taskService = TestBed.inject(TaskService);
			router = TestBed.inject(Router);
			getElements();
			cancelButton = dataTest('cancel-button');
		});

		it('has empty inputs', () => {
			// Arrange
			const deleteButton = dataTestIf('delete-button');
			// Assert
			expect(taskTitleInput.nativeElement.value).toEqual('');
			expect(taskDescriptionInput.nativeElement.value).toEqual('');
			expect(deleteButton).toBe(false);
		});

		it('returns to task board without saving on click cancel', () => {
			// Act
			cancelButton.nativeElement.click();
			// Assert
			expect(taskService.addTask).not.toHaveBeenCalled();
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('saves an empty task and returns to task board', () => {
			// Arrange
			const savedTask: CreateTask = {
				title: '',
				description: '',
				status: TaskStatus.Todo,
			};
			// Act
			saveButton.nativeElement.click();
			// Assert
			expect(taskService.addTask).toHaveBeenCalledTimes(1);
			expect(taskService.addTask).toHaveBeenCalledWith(savedTask);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('saves new task', () => {
			const savedTask: CreateTask = {
				title: 'new',
				description: 'New task',
				status: TaskStatus.Todo,
			};
			// Act
			ngMocks.change(taskTitleInput, savedTask.title);
			ngMocks.change(taskDescriptionInput, savedTask.description);
			saveButton.nativeElement.click();
			// Assert
			expect(taskService.editTask).not.toHaveBeenCalled();
			expect(taskService.addTask).toHaveBeenCalledTimes(1);
			expect(taskService.addTask).toHaveBeenCalledWith(savedTask);
		});
	});

	describe('Edit task', () => {
		beforeEach(() => {
			// Arrange
			const params: TestParams = {
				id: mockTask.id,
			};
			MockRender(EditTaskComponent, params);
			taskService = TestBed.inject(TaskService);
			router = TestBed.inject(Router);
			getElements();
			deleteButton = dataTest('delete-button');
		});

		it('Updates form with task data and saves unchanged task', () => {
			// Arrange
			const cancelButton = dataTestIf('cancel-button');
			// Assert
			expect(taskTitleInput.nativeElement.value).toEqual(mockTask.title);
			expect(taskDescriptionInput.nativeElement.value).toEqual(
				mockTask.description
			);
			expect(deleteButton).toBeTruthy();
			expect(cancelButton).toBe(false);
			// Act
			saveButton.nativeElement.click();
			// Assert
			expect(taskService.addTask).not.toHaveBeenCalled();
			expect(taskService.editTask).toHaveBeenCalledTimes(1);
			expect(taskService.editTask).toHaveBeenCalledWith(mockTask);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});

		it('deletes task', () => {
			// Act
			deleteButton.nativeElement.click();
			// Assert
			expect(taskService.deleteTask).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(TASK_BOARD_ROUTE);
		});
	});
});
