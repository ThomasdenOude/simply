import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { TaskGroupComponent } from './task-group.component';
import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { TestParams } from '../../../../test/models/test-params.model';
import { Devices } from '../../../base/models/devices.model';
import { dataTest } from '../../../../test/helpers/data-test.helper';
import { getMockedTaskList } from '../../test/mocked-data/mocked-task-list';

describe('TaskBoardGroupComponent', () => {
	let component: TaskGroupComponent;
	let fixture: MockedComponentFixture<TaskGroupComponent, TestParams>;
	let statusTabButtons: MockedDebugElement<CdkDropList>[];
	let statusTabText: MockedDebugElement;
	let taskLists: MockedDebugElement<CdkDropList>[];
	let taskCards: MockedDebugElement<TaskCardComponent>[];
	const mockTaskList: Task[] = getMockedTaskList();

	const params: TestParams = {
		taskList: [...mockTaskList],
		activeList: TaskStatus.Doing,
		device: Devices.HandsetLandscape,
		editDoneId: 'two',
	};

	beforeEach(() =>
		MockBuilder(TaskGroupComponent, [DragDropModule, TaskCardComponent])
	);

	beforeEach(() => {
		fixture = MockRender(TaskGroupComponent, params);
		component = fixture.point.componentInstance;

		statusTabButtons = ngMocks.findAll(['data-test', 'status-tab-button']);
		taskLists = ngMocks.findAll(['data-test', 'task-list']);
		taskCards = ngMocks.findAll(['data-test', 'task-card']);
	});

	it('show tab buttons', () => {
		expect(statusTabButtons.length).toBe(3);
		expect(
			statusTabButtons[0].classes['simply-task-group__active-tab']
		).toBeUndefined();
		expect(statusTabButtons[1].classes['simply-task-group__active-tab']).toBe(
			true
		);
		expect(
			statusTabButtons[2].classes['simply-task-group__active-tab']
		).toBeUndefined();
		// Arrange
		statusTabText = ngMocks.find(statusTabButtons[0], [
			'data-test',
			'status-tab-text',
		]);
		// Assert
		expect(statusTabText.nativeElement.textContent).toBe(TaskStatus.Todo);
	});

	it('emits status change on click status tab button', () => {
		// Arrange
		let statusChange: TaskStatus | undefined;
		component.statusChange.subscribe(value => {
			statusChange = value;
		});
		// Act
		statusTabButtons[0].nativeElement.click();
		// Assert
		expect(statusChange).toBe(TaskStatus.Todo);
	});

	it('shows task list, only active list visible', () => {
		// Assert
		expect(taskLists.length).toBe(3);
		expect(taskLists[0].classes['simply-task-group__list-hidden']).toBe(true);
		expect(
			taskLists[1].classes['simply-task-group__list-hidden']
		).toBeUndefined();
		expect(taskLists[2].classes['simply-task-group__list-hidden']).toBe(true);
		// Arrange
		taskCards = ngMocks.findAll(taskLists[1], ['data-test', 'task-card']);
		// Assert
		expect(taskCards.length).toBe(1);
		expect(taskCards[0].componentInstance.task).toEqual(mockTaskList[1]);
		expect(taskCards[0].classes['task-card__drag']).toBeUndefined();
		expect(taskCards[0].classes['task-card__edited']).toBe(true);
	});

	it('emits edit task on click task card', () => {
		// Arrange
		taskCards = ngMocks.findAll(taskLists[1], ['data-test', 'task-card']);
		let editTask: Task | undefined;
		component.editTask.subscribe(value => {
			editTask = value;
		});
		// Act
		taskCards[0].componentInstance.editTask.emit(mockTaskList[1]);
		// Assert
		expect(editTask).toBe(mockTaskList[1]);
	});

	it('emits new task on click add button', () => {
		// Arrange
		const addButton = dataTest('add-button');
		let newTask = false;
		component.newTask.subscribe(value => {
			newTask = true;
		});
		// Act
		addButton.nativeElement.click();
		// Arrange
		expect(newTask).toBe(true);
	});
});
