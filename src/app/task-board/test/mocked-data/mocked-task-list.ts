import { TaskStatus } from '../../models/task-status';
import { Task } from '../../models/task';

const mockedTaskList: Task[] = [
	{
		id: 'one',
		index: 0,
		title: 'One',
		description: 'One description',
		status: TaskStatus.Todo,
	},
	{
		id: 'two',
		index: 0,
		title: 'Two',
		description: 'Two description',
		status: TaskStatus.Doing,
	},
	{
		id: 'three',
		index: 0,
		title: 'Three',
		description: 'Three description',
		status: TaskStatus.Done,
	},
];

export function getMockedTaskList(): Task[] {
	return JSON.parse(JSON.stringify(mockedTaskList));
}
