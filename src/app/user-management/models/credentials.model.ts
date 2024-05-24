import { BaseForm } from '../../base/models/base-form.model';

export type Credentials = Password & Email;

export type CredentialsForm = BaseForm<Credentials>;

export type Password = {
	password: string | null;
};

export type Email = {
	email: string | null;
};

export type EmailForm = BaseForm<Email>;

export type PasswordForm = BaseForm<Password>;
