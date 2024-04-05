import { FormControl } from '@angular/forms';

export type NewPassword = {
	newPassword: string | null;
	repeatPassword: string | null;
};

export type NewPasswordForm = {
	[Property in keyof NewPassword]: FormControl<NewPassword[Property]>;
};
