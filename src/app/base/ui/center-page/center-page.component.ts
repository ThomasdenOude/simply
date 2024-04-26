import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

import { ResponsiveService } from '../../services/responsive.service';
import { Devices } from '../../models/devices';
import { BaseSizes } from '../../models/style-sizes';

@Component({
	selector: 'simply-center-page',
	standalone: true,
	imports: [NgClass, NgStyle],
	templateUrl: './center-page.component.html',
	styleUrl: './center-page.component.scss',
})
export class CenterPageComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);

	protected readonly Devices = Devices;
	protected device: Signal<Devices> = this.responsiveService.device;

	public maxContentWidth: InputSignal<BaseSizes> = input<BaseSizes>('regular');
}
