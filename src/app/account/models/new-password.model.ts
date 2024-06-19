import { BaseForm } from '../../base/models/base-form.model';

export type NewPassword = {
	newPassword: string | null;
	repeatPassword: string | null;
};

export type NewPasswordForm = BaseForm<NewPassword>;
