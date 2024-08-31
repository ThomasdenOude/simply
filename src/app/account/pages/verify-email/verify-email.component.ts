import { Component, computed, inject, OnDestroy, Signal } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { TextContentDirective } from '../../../base/directives/text-content.directive';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { TASK_BOARD_ROUTE } from '../../../base/guards/auth-guards';

@Component({
	selector: 'simply-verify-email',
	standalone: true,
	imports: [
		CenterPageComponent,
		MatFormField,
		MatLabel,
		MatInput,
		FocusInputDirective,
		MatDivider,
		MatButton,
		TextContentDirective,
		SpaceContentDirective,
	],
	templateUrl: './verify-email.component.html',
	styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnDestroy {
	private destroy: Subject<void> = new Subject<void>();

	private authService: AuthenticationService = inject(AuthenticationService);
	private navigationService: NavigationService = inject(NavigationService);
	private router: Router = inject(Router);

	private user: Signal<User | null> = this.authService.user;
	protected email: Signal<string | null | undefined> = computed(
		() => this.user()?.email
	);
	private browserTabReturned$: Observable<null> =
		this.navigationService.browserTabReturned$;

	protected sendVerificationLink(): void {
		const user = this.user();

		if (user) {
			this.authService.sendEmailVerification(user).then(() => {
				this.browserTabReturned$.pipe(takeUntil(this.destroy)).subscribe(() => {
					void this.router.navigate(TASK_BOARD_ROUTE);
				});
			});
		}
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
