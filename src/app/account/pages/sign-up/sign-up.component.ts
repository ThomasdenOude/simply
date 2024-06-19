import {
  Component,
  inject, OnDestroy,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { FirebaseError } from '@firebase/util';
import { map, Observable, Subject, takeUntil } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

import { NavigationService } from '../../services/navigation.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { SpaceContentDirective } from '../../../base/directives/space-content.directive';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { FocusInputDirective } from '../../../base/directives/focus-input.directive';
import { Email, EmailForm } from '../../models/credentials.model';
import { Devices } from '../../../base/models/devices';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { toSignal } from '@angular/core/rxjs-interop';
import { TASK_BOARD_ROUTE, VERIFY_EMAIL_ROUTE } from '../../../base/guards/auth-guards';

@Component({
	selector: 'simply-sign-up',
	standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    NewPasswordComponent,
    MatDivider,
    MessageComponent,
    CenterPageComponent,
    FocusInputDirective,
    SpaceContentDirective,
    RouterLink,
  ],
	templateUrl: './sign-up.component.html',
	styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnDestroy {
  private destroy: Subject<void> = new Subject<void>();

  private authService: AuthenticationService = inject(AuthenticationService);
  private navigationService: NavigationService = inject(NavigationService);
  private responsiveService: ResponsiveService = inject(ResponsiveService);
	private router: Router = inject(Router);

  private browserTabReturned$: Observable<null> = this.navigationService.browserTabReturned$
  protected readonly AuthenticationMessages = AuthenticationMessages;
	protected device: Signal<Devices> = this.responsiveService.device;
	protected readonly Devices = Devices;

  private readonly emailChange: Signal<string | undefined>;
	protected continue: WritableSignal<boolean> = signal(false);
	protected signupError: WritableSignal<AuthenticationMessages> = signal(
		AuthenticationMessages.None
	);

  protected emailForm: FormGroup<EmailForm> = new FormGroup<EmailForm>({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  constructor() {
    const emailChange$: Observable<string> = this.emailForm.valueChanges
      .pipe(
        map((value: Partial<Email>) => value.email ?? '')
      )
    this.emailChange = toSignal(emailChange$)
  }

	protected submitEmail(): void {
		const valid = this.emailForm.valid;
		const email: Partial<Email> = this.emailForm.value;
		if (valid && email.email) {
			this.continue.set(true);
		}
	}

	protected signUp(newPassword: string): void {
    const emailChange = this.emailChange();
    const valid = this.emailForm.valid

    if (emailChange && valid) {
			this.authService
				.creatUserAndVerifyEmail(emailChange, newPassword)
				.then(() => {
					// Signed up
          void this.router.navigate(VERIFY_EMAIL_ROUTE);

          this.browserTabReturned$
            .pipe(takeUntil(this.destroy))
            .subscribe(() => {
              void this.router.navigate(TASK_BOARD_ROUTE)
            })
				})
				.catch((error: FirebaseError) => {
          this.continue.set(false);
					this.signupError.set(
						this.authService.getAuthenticationMessage(error)
					);
				});
		}
	}

	protected resetError() {
		this.signupError.set(AuthenticationMessages.None);
	}

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
