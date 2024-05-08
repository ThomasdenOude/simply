import {
	AfterViewInit,
	Component,
	computed,
	ElementRef,
	EventEmitter,
	inject,
	input,
	InputSignal,
	Output,
	signal,
	Signal,
	ViewChild,
	WritableSignal,
} from '@angular/core';
import { NgClass } from '@angular/common';

import {
	fromEvent,
	map,
	Observable,
	Subject,
	switchMap,
	takeUntil,
	tap,
	timer,
} from 'rxjs';

import {
	CdkDrag,
	CdkDragDrop,
	CdkDropList,
	CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { MatIcon } from '@angular/material/icon';
import { MatMiniFabButton } from '@angular/material/button';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { TaskCardComponent } from '../task-card/task-card.component';
import { NoSpaceDirective } from '../../../base/directives/no-space.directive';
import { Devices } from '../../../base/models/devices';
import { Task, TaskStatus } from '../../models/task.model';
import { UpdateTaskAndStatus } from '../../models/update-task-and-status';
import { TASK_STATUS_LIST } from '../../data/task-status-list';
import { taskStatusIcon } from '../../data/task-status-icon.map';

@Component({
	selector: 'simply-task-group',
	standalone: true,
	imports: [
		NgClass,
		CdkDropListGroup,
		MatIcon,
		NoSpaceDirective,
		CdkDropList,
		CdkDrag,
		TaskCardComponent,
		MatMiniFabButton,
	],
	templateUrl: './task-group.component.html',
	styleUrl: './task-group.component.scss',
})
export class TaskGroupComponent implements AfterViewInit {
	private destroy: Subject<void> = new Subject<void>();
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	protected device: Signal<Devices> = this.responsiveService.device;
	protected activeStatus: WritableSignal<TaskStatus> = signal(TaskStatus.Todo);

	protected readonly Devices = Devices;
	protected readonly taskStatuses: ReadonlyArray<TaskStatus> = TASK_STATUS_LIST;
	protected readonly taskStatusIcon = taskStatusIcon;

	public taskList: InputSignal<Task[]> = input.required<Task[]>();

	@ViewChild('content', { read: ElementRef })
	private content!: ElementRef;

	@Output()
	public onUpdateTaskAndStatus: EventEmitter<UpdateTaskAndStatus> =
		new EventEmitter<UpdateTaskAndStatus>();

	@Output()
	public onNewTask: EventEmitter<void> = new EventEmitter<void>();

	@Output()
	public onEditTask: EventEmitter<Task> = new EventEmitter<Task>();

	ngAfterViewInit() {
		const touchEnd$: Observable<TouchEvent> = fromEvent(
			this.content.nativeElement,
			'touchend'
		);
		const touchEndTimed$: Observable<TouchEvent> = touchEnd$.pipe(
			takeUntil(timer(300))
		);
		const touchStart$: Observable<TouchEvent> = fromEvent(
			this.content.nativeElement,
			'touchstart'
		);
		touchStart$
			.pipe(
				takeUntil(this.destroy),
				switchMap(() => touchEndTimed$),
				map(touch => {
					const target = touch.target as HTMLElement;

					return target.matches('.task-card__element');
				})
			)
			.subscribe((onTaskCard: boolean) => {
				if (!onTaskCard) {
					this.newTask();
				}
			});
	}

	protected selectStatus(status: TaskStatus) {
		this.activeStatus.set(status);
	}

	protected switchTab(status: TaskStatus): void {
		this.activeStatus.set(status);
	}

	protected taskListSignal(status: TaskStatus): Signal<Task[]> {
		return computed(() =>
			this.taskList()
				.filter((task: Task) => task.status === status)
				.sort((a: Task, b: Task) => a.index - b.index)
		);
	}

	protected newTask(): void {
		this.onNewTask.emit();
	}

	protected editTask(task: Task): void {
		this.onEditTask.emit(task);
	}

	public updateTaskAndStatus(
		event: CdkDragDrop<Task[]>,
		targetStatus?: TaskStatus
	): void {
		const updateTaskAndStatus: UpdateTaskAndStatus = {
			taskDropped: event,
		};
		if (targetStatus) {
			updateTaskAndStatus.targetStatus = targetStatus;
		}
		this.onUpdateTaskAndStatus.emit(updateTaskAndStatus);
	}
}
