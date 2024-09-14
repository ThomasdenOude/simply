import { Component, Signal, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { filter, map, Observable, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatCard } from '@angular/material/card';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

import { ResponsiveService } from '../base/services/responsive.service';
import { AuthenticationService } from '../account/services/authentication-service/authentication.service';
import { Devices } from '../base/models/devices.model';
import { LogoComponent } from '../base/ui/logo/logo.component';

@Component({
	selector: 'simply-header',
	standalone: true,
	imports: [
		MatButtonModule,
		MatIconModule,
		RouterLink,
		CdkMenuTrigger,
		MatDivider,
		CdkMenuItem,
		CdkMenu,
		MatCard,
		NgClass,
		LogoComponent,
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
	protected emailVerified: Signal<boolean> = computed(
		() => this.authService.user()?.emailVerified ?? false
	);
	protected isOnLoginPage: Signal<boolean | undefined> = toSignal(
		this.isOnPath('log-in')
	);
	protected isOnSettingsPage: Signal<boolean | undefined> = toSignal(
		this.isOnPath('settings')
	);
	protected isOnAuthenticatePage: Signal<boolean | undefined> = toSignal(
		this.isOnPath('authenticate')
	);

	protected userEmail: Signal<string> = computed(
		() => this.authService.user()?.email ?? ''
	);

	constructor() {}
	private isOnPath(path: string): Observable<boolean> {
		return this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(event => (event as NavigationEnd).url.includes(path)),
			startWith(false)
		);
	}

	protected logout(): void {
		this.authService
			.logout()
			.then(() => {
				// Signed out
				void this.router.navigate(['/']);
			})
			.catch();
	}
}
