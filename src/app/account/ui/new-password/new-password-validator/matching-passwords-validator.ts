import { FormGroup, ValidationErrors } from '@angular/forms';
import { NewPasswordForm } from '../../../models/new-password.model';

export const matchingPasswordsValidator =
	(formGroup: FormGroup<NewPasswordForm>) => (): ValidationErrors | null => {
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
