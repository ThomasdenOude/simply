import {
	Component,
	computed,
	effect,
	inject,
	OnDestroy,
	Signal,
} from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from '@angular/fire/auth';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';

import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { VisibilityChangesService } from '../../services/visibility-changes.service';
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
	private visibilityChangesService: VisibilityChangesService = inject(
		VisibilityChangesService
	);
	private router: Router = inject(Router);

	private user: Signal<User | null> = this.authService.user;
	protected email: Signal<string | null | undefined> = computed(
		() => this.user()?.email
	);
	private browserTabReturned: Signal<boolean | undefined> =
		this.visibilityChangesService.browserTabReturned;

	constructor() {
		effect(() => {
			if (this.browserTabReturned() && this.user()?.emailVerified) {
				void this.router.navigate(TASK_BOARD_ROUTE);
			}
		});
	}

	protected sendVerificationLink(): void {
		const user = this.user();

		if (user) {
			void this.authService.sendEmailVerification(user);
		}
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
