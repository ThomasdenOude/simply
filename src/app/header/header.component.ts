import { Component, Signal, inject, computed } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ResponsiveService } from '../base/services/responsive.service';
import { AuthenticationService } from '../base/services/authentication.service';
import { Devices } from '../base/models/devices';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { MatDivider } from '@angular/material/divider';
import { MatCard } from '@angular/material/card';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [
		NgClass,
		MatButtonModule,
		MatIconModule,
		AsyncPipe,
		RouterLink,
		MatMenu,
		CdkMenuTrigger,
		MatMenuTrigger,
		MatMenuItem,
		MatDivider,
		CdkMenuItem,
		CdkMenu,
		MatCard,
	],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	private authService: AuthenticationService = inject(AuthenticationService);
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

	protected isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;
	protected isOnLoginPage: Signal<boolean | undefined> = toSignal(
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(event => (event as NavigationEnd).url.includes('log-in'))
		)
	);
	protected userEmail: Signal<string> = computed(
		() => this.authService.user()?.email ?? ''
	);

	protected logout(): void {
		this.authService.logout();
	}
}
