import { Component, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { Devices } from '../../../base/models/devices';

@Component({
	selector: 'app-task-board-group',
	standalone: true,
	imports: [NgClass],
	templateUrl: './task-board-group.component.html',
	styleUrl: './task-board-group.component.scss',
})
export class TaskBoardGroupComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	protected device: Signal<Devices> = this.responsiveService.device;

	protected readonly Devices = Devices;
}
