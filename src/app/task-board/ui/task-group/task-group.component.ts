import { Component, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { Devices } from '../../../base/models/devices';

@Component({
	selector: 'simply-task-group',
	standalone: true,
	imports: [NgClass],
	templateUrl: './task-group.component.html',
	styleUrl: './task-group.component.scss',
})
export class TaskGroupComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	protected device: Signal<Devices> = this.responsiveService.device;

	protected readonly Devices = Devices;
}
