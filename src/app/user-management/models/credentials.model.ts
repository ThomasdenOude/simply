import { FormControl } from '@angular/forms';

export type Credentials = {
	email: string | null;
	password: string | null;
};

export type CredentialsForm = {
	[Property in keyof Credentials]: FormControl<Credentials[Property]>;
};
