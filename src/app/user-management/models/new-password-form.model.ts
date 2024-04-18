import { BaseForm } from '../../base/models/base-form-group.model';

export type NewPassword = {
	newPassword: string | null;
	repeatPassword: string | null;
};

export type NewPasswordForm = BaseForm<NewPassword>;
