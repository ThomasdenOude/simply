import { BaseForm } from '../../base/models/base-form-group.model';

export type Credentials = Password & {
	email: string | null;
};

export type CredentialsForm = BaseForm<Credentials>;

export type Password = {
	password: string | null;
};

export type PasswordForm = BaseForm<Password>;
