import {
	AbstractControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
} from '@angular/forms';

export const matchingPasswordsValidator =
	(formGroup: FormGroup) => (): ValidationErrors | null => {
		const newPasswordControl = formGroup.get('newPassword');
		const repeatPasswordControl = formGroup.get('repeatPassword');

		if (!newPasswordControl || !repeatPasswordControl) {
			return null;
		}
		const newValue = newPasswordControl.value;
		const repeatValue = repeatPasswordControl.value;
		if (newValue && repeatValue && newValue !== repeatValue) {
			return { differentPasswords: true };
		}
		return null;
	};
