import { KanbanComponent } from './kanban.component';
import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';

import { TestParams } from '../../../../test/models/test-params.model';
import { dataTest } from '../../../../test/helpers/data-test.helper';

import { TaskCardComponent } from '../task-card/task-card.component';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';
import { getMockedTaskList } from '../../test/mocked-data/mocked-task-list';

describe('KanbanComponent', () => {
	let component: KanbanComponent;
	let fixture: MockedComponentFixture<KanbanComponent, TestParams>;
	let listContent: MockedDebugElement<CdkDropList<Task[]>>[];
	let cards: MockedDebugElement<TaskCardComponent>[];
	const mockTaskList: Task[] = getMockedTaskList();

	beforeEach(() =>
		MockBuilder(KanbanComponent, [DragDropModule, TaskCardComponent])
	);

	describe('List', () => {
		const params: TestParams = {
			taskList: [...mockTaskList],
			editDoneId: 'two',
		};

		beforeEach(() => {
			fixture = MockRender(KanbanComponent, params);
			component = fixture.point.componentInstance;
			listContent = ngMocks.findAll(['data-test', 'list-content']);
		});

		it('shows link to add task and list headers', () => {
			// Arrange
			const addTaskLink: MockedDebugElement = dataTest('task-link');
			const listHeader: MockedDebugElement[] = ngMocks.findAll([
				'data-test',
				'list-header',
			]);
			// Assert
			expect(addTaskLink.nativeElement.textContent).toBe('Add task');
			expect(addTaskLink.attributes['routerLink']).toBe('task');
			expect(listHeader.length).toBe(3);
			expect(listHeader[0].nativeElement.textContent).toBe(TaskStatus.Todo);
			expect(listHeader[1].nativeElement.textContent).toBe(TaskStatus.Doing);
			expect(listHeader[2].nativeElement.textContent).toBe(TaskStatus.Done);
		});

		it('shows tasks lists with cards', () => {
			// Assert
			expect(listContent.length).toBe(3);
			cards = ngMocks.findAll(listContent[0], TaskCardComponent);
			expect(cards.length).toBe(1);
			expect(cards[0].componentInstance.task).toEqual(mockTaskList[0]);
		});

		it('emits update task', () => {
			// Arrange
			let editTask: Task | undefined;
			component.editTask.subscribe(value => {
				editTask = value;
			});
			cards = ngMocks.findAll(listContent[0], TaskCardComponent);
			const card: TaskCardComponent = cards[0].componentInstance;
			const task: Task = mockTaskList[0];
			// Act
			card.editTask.emit(task);
			// Assert
			expect(editTask).toEqual(task);
		});
	});
});
