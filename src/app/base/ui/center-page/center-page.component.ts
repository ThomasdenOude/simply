import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { ResponsiveService } from '../../services/responsive.service';
import { Devices } from '../../models/devices';

@Component({
	selector: 'app-center-page',
	standalone: true,
	imports: [NgClass, NgStyle],
	templateUrl: './center-page.component.html',
	styleUrl: './center-page.component.scss',
})
export class CenterPageComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected readonly Devices = Devices;
	protected device: Signal<Devices> = this.responsiveService.device;

	public maxContentWidth: InputSignal<number> = input<number>(600);
}
