import {
	Component,
	OnDestroy,
	forwardRef,
	input,
	effect,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit,
} from '@angular/core';
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	FormsModule,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	ValidationErrors,
	Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, fromEvent, Subject, takeUntil } from 'rxjs';

import { matchingPasswordsValidator } from './new-password-validator/matching-passwords-validator';
import {
	NewPassword,
	NewPasswordForm,
} from '../../models/new-password-form.model';

@Component({
	selector: 'app-new-password-form-field',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		FormsModule,
	],
	templateUrl: './new-password-form-field.component.html',
	styleUrl: './new-password-form-field.component.scss',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => NewPasswordFormFieldComponent),
			multi: true,
		},
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => NewPasswordFormFieldComponent),
			multi: true,
		},
	],
})
export class NewPasswordFormFieldComponent
	implements OnDestroy, AfterViewInit, ControlValueAccessor
{
	private destroy: Subject<void> = new Subject<void>();
	private _onChange: ((password: string) => void) | undefined;
	private _onTouched: (() => void) | undefined;

	protected newPasswordForm: FormGroup<NewPasswordForm> = new FormGroup({
		newPassword: new FormControl('', [Validators.required]),
		repeatPassword: new FormControl('', [Validators.required]),
	});

	public markAsTouched = input<boolean>(false);
	@ViewChild('form', { read: ElementRef })
	private form: ElementRef | undefined;
	@Output()
	public isSubmitted = new EventEmitter<void>();

	constructor() {
		const password = this.newPasswordForm.get('newPassword');
		const repeat = this.newPasswordForm.get('repeatPassword');

		repeat?.addValidators(matchingPasswordsValidator(this.newPasswordForm));

		this.newPasswordForm.valueChanges
			.pipe(takeUntil(this.destroy))
			.subscribe((formValue: Partial<NewPassword>) =>
				this.onChanged(formValue)
			);

		effect(() => {
			if (this.markAsTouched()) {
				password?.markAsDirty();
				password?.markAsTouched();
				repeat?.markAsDirty();
				repeat?.markAsTouched();
			}
		});
	}

	ngAfterViewInit() {
		if (this.form) {
			fromEvent<KeyboardEvent>(this.form.nativeElement, 'keydown')
				.pipe(
					takeUntil(this.destroy),
					filter((event: KeyboardEvent) => event.code === 'Enter')
				)
				.subscribe(() => this.isSubmitted.emit());
		}
	}

	public registerOnChange(fn: any): void {
		this._onChange = fn;
	}

	public registerOnTouched(fn: any): void {
		this._onTouched = fn;
	}

	public setDisabledState(isDisabled: boolean) {
		isDisabled ? this.newPasswordForm.disable() : this.newPasswordForm.enable();
	}

	public writeValue(): void {
		/*
		 *    Not allowed to prefill the password field
		 *    User has to provide a new password
		 */
	}

	public validate(): ValidationErrors | null {
		const isNotValid = this.newPasswordForm.invalid;
		if (isNotValid) {
			return {
				invalidPassword: true,
			};
		} else return null;
	}
	protected onTouched() {
		if (this._onTouched) {
			this._onTouched();
		}
	}

	protected onChanged(formValue: Partial<NewPassword>) {
		if (this._onChange) {
			const password = formValue.newPassword;
			const repeat = formValue.repeatPassword;
			if (password && password === repeat) {
				this._onChange(password);
			} else {
				this._onChange('');
			}
		}
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.complete();
	}
}
