import { Component, computed, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { Devices } from '../../../base/models/devices';
import { RouterLink } from '@angular/router';
import { BaseSizes } from '../../../base/models/style-sizes';
import { TextContentDirective } from '../../../base/directives/text-content.directive';

@Component({
	selector: 'simply-welcome',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		NgClass,
		RouterLink,
		CenterPageComponent,
		TextContentDirective,
	],
	templateUrl: './welcome.component.html',
	styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected maxWidth: Signal<BaseSizes> = computed(() =>
		this.device() === Devices.WideScreen ? 'regular' : 'small'
	);
}
