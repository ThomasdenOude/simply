import { Component, computed, inject, Signal } from '@angular/core';
import { NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../../../base/services/responsive.service';
import { Devices } from '../../../base/models/devices';
import { RouterLink } from '@angular/router';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';

@Component({
	selector: 'app-welcome-page',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		NgClass,
		RouterLink,
		CenterPageComponent,
	],
	templateUrl: './welcome.component.html',
	styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected maxWidth: Signal<number> = computed(() =>
		this.device() === Devices.WideScreen ? 600 : 400
	);
}
