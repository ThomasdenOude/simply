import { BaseForm } from '../../base/models/base-form.model';

export type BaseCredentials = Password & Email;

export type BaseCredentialsForm = BaseForm<BaseCredentials>;

export type Password = {
	password: string | null;
};

export type Email = {
	email: string | null;
};

export type EmailForm = BaseForm<Email>;

export type PasswordForm = BaseForm<Password>;
