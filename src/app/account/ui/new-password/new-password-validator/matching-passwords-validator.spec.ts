import { FormControl, FormGroup } from '@angular/forms';

import { NewPasswordForm } from '../../../models/new-password.model';
import { matchingPasswordsValidator } from './matching-passwords-validator';

describe('matchingPasswordsValidator', () => {
	const form: FormGroup<NewPasswordForm> = new FormGroup<NewPasswordForm>({
		newPassword: new FormControl(null),
		repeatPassword: new FormControl(null),
	});

	it('matches if both controls are null', () => {
		const result = matchingPasswordsValidator(form);
		expect(result()).toBe(null);
	});

	it('matches if both controls are the same value', () => {
		// Act
		form.patchValue({
			newPassword: 'test',
			repeatPassword: 'test',
		});
		const result = matchingPasswordsValidator(form);
		// Assert
		expect(result()).toBe(null);
	});

	it('returns validation error if controls have different value', () => {
		// Act
		form.patchValue({
			newPassword: 'left',
			repeatPassword: 'lefty',
		});
		const result = matchingPasswordsValidator(form);
		// Assert
		expect(result()).toEqual({ differentPasswords: true });
	});
});
