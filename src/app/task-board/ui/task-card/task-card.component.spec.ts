import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { CdkDrag } from '@angular/cdk/drag-drop';

import { dataTest } from '../../../../test/helpers/data-test.helper';
import { TestParams } from '../../../../test/models/test-params.model';

import { TaskCardComponent } from './task-card.component';
import { Task } from '../../models/task';
import { TaskStatus } from '../../models/task-status';

describe('TaskComponent', () => {
	let fixture: MockedComponentFixture<TaskCardComponent, TestParams>;
	const mockTask: Task = {
		id: 'one',
		index: 0,
		title: 'One',
		description: 'One description',
		status: TaskStatus.Todo,
	};

	beforeEach(() =>
		MockBuilder(TaskCardComponent, CdkDrag).provide({
			provide: CdkDrag,
			useValue: { data: mockTask },
		})
	);

	it('shows title', () => {
		// Arrange
		const params: TestParams = {
			task: mockTask,
		};
		fixture = MockRender(TaskCardComponent, params);
		const title = dataTest('card-title');
		expect(title.nativeElement.textContent).toBe(mockTask.title);
	});
});
