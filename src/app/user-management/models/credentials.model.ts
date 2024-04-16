import { FormControl } from '@angular/forms';

export type Credentials = Password & {
	email: string | null;
};

export type CredentialsForm = SimplyForm<Credentials>;

export type Password = {
	password: string | null;
};

export type PasswordForm = SimplyForm<Password>;

export type SimplyForm<T> = {
	[Property in keyof T]: FormControl<T[Property]>;
};
