import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import { mock } from 'jest-mock-extended';

import { ResponsiveServiceMock } from '../../../base/services/responsive.service.mock';
import { RouterMock } from '../../../../test/mocks/router.mock';
import { getMockedTaskList } from '../../test/mocked-data/mocked-task-list';
import {
	dataTest,
	dataTestIf,
} from '../../../../test/helpers/data-test.helper';

import { TaskService } from '../../services/task.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { TaskBoardComponent } from './task-board.component';
import { TaskGroupComponent } from '../../ui/task-group/task-group.component';
import { KanbanComponent } from '../../ui/kanban/kanban.component';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { Devices } from '../../../base/models/devices.model';
import { UpdateTaskListAndStatus } from '../../models/update-task-list-and-status';

jest.mock('@angular/cdk/drag-drop');

describe('TaskManagerComponent', () => {
	let fixture: MockedComponentFixture<TaskBoardComponent>;
	let taskService: TaskService;
	let router: Router;
	let route: ActivatedRoute;
	let taskGroupComponent: TaskGroupComponent;
	let kanbanComponent: KanbanComponent;

	const mockRouter = new RouterMock();
	const mockResponsiveService = new ResponsiveServiceMock();
	const mockTaskList: Task[] = getMockedTaskList();

	const mockDragDropped: CdkDragDrop<Task[]> = mock<CdkDragDrop<Task[]>>({
		previousContainer: {
			id: TaskStatus.Todo,
		},
		container: {
			id: TaskStatus.Todo,
		},
	});

	beforeEach(() =>
		MockBuilder(TaskBoardComponent, [
			TaskService,
			ResponsiveService,
			Router,
			ActivatedRoute,
		])
			.mock(Router, mockRouter)
			.mock(TaskService, {
				taskList: signal(mockTaskList),
				activeList: signal(TaskStatus.Doing),
				editDoneId: signal(mockTaskList[1].id),
				setEditTaskDone: jest.fn(),
				setActiveList: jest.fn(),
			})
			.mock(ResponsiveService, mockResponsiveService)
	);

	beforeEach(() => {
		// Arrange
		fixture = MockRender(TaskBoardComponent);
		taskService = TestBed.inject(TaskService);
		router = TestBed.inject(Router);
		route = TestBed.inject(ActivatedRoute);
		fixture.detectChanges();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Mobile view', () => {
		beforeEach(() => {
			// Act
			mockResponsiveService.deviceSignal.set(Devices.Small);
			fixture.detectChanges();

			const taskGroup = dataTest('task-group');
			taskGroupComponent = taskGroup.componentInstance;
		});

		it('only shows task group', () => {
			// Arrange
			const kanban = dataTestIf('kanban');
			const taskList = taskGroupComponent.taskList;
			const activeList = taskGroupComponent.activeList;
			const editDoneId = taskGroupComponent.editDoneId;
			// Assert
			expect(kanban).toBe(false);
			expect(taskGroupComponent).toBeTruthy();
			expect(taskList).toEqual(mockTaskList);
			expect(activeList).toBe(TaskStatus.Doing);
			expect(editDoneId).toBe(mockTaskList[1].id);
		});

		it('sets active list', () => {
			// Act
			taskGroupComponent.statusChange.emit(TaskStatus.Todo);
			// Assert
			expect(taskService.setActiveList).toHaveBeenCalledTimes(1);
			expect(taskService.setActiveList).toHaveBeenCalledWith(TaskStatus.Todo);
		});

		it('navigates to task page for new task', () => {
			// Act
			taskGroupComponent.newTask.emit();
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(['task'], {
				relativeTo: route,
			});
		});

		it('navigates to task page for edit task', () => {
			// Act
			taskGroupComponent.editTask.emit(mockTaskList[0]);
			// Assert
			expect(router.navigate).toHaveBeenCalledTimes(1);
			expect(router.navigate).toHaveBeenCalledWith(
				['task', mockTaskList[0].id],
				{
					relativeTo: route,
				}
			);
		});

		it('sets edit task done', () => {
			// Act
			taskGroupComponent.editTaskDone.emit(mockTaskList[0]);
			// Assert
			expect(taskService.setEditTaskDone).toHaveBeenCalledTimes(1);
			expect(taskService.setEditTaskDone).toHaveBeenCalledWith(mockTaskList[0]);
		});

		it('updates task list index', () => {
			// Arrange
			const update: UpdateTaskListAndStatus = {
				taskDropped: mockDragDropped,
			};
			// Act
			taskGroupComponent.updateTaskList.emit(update);
			// Assert
			expect(taskService.updateIndex).toHaveBeenCalledTimes(1);
			expect(taskService.updateIndex).toHaveBeenCalledWith(
				TaskStatus.Todo,
				mockDragDropped.container.data
			);
			expect(taskService.updateIndexAndStatus).not.toHaveBeenCalled();
		});

		it('updates task list index and status', () => {
			// Arrange
			const update: UpdateTaskListAndStatus = {
				taskDropped: mockDragDropped,
				targetStatus: TaskStatus.Doing,
			};
			// Act
			taskGroupComponent.updateTaskList.emit(update);
			// Assert
			expect(taskService.updateIndexAndStatus).toHaveBeenCalledTimes(1);
			expect(taskService.updateIndexAndStatus).toHaveBeenCalledWith(
				mockDragDropped.previousContainer.id,
				mockDragDropped.previousContainer.data,
				TaskStatus.Doing,
				[mockTaskList[1]]
			);
			expect(taskService.updateIndex).not.toHaveBeenCalled();
		});
	});

	describe('Desktop or tablet view', () => {
		beforeEach(() => {
			// Act
			mockResponsiveService.deviceSignal.set(Devices.WideScreen);
			fixture.detectChanges();
			// Arrange
			const kanban = dataTest('kanban');
			kanbanComponent = kanban.componentInstance;
		});

		it('only shows kanban', () => {
			// Arrange
			const taskGroup = dataTestIf('task-group');
			const taskList = kanbanComponent.taskList;
			const editDoneId = taskGroupComponent.editDoneId;
			// Assert
			expect(taskGroup).toBe(false);
			expect(taskGroupComponent).toBeTruthy();
			expect(taskList).toEqual(mockTaskList);
			expect(editDoneId).toBe(mockTaskList[1].id);
		});
	});
});
