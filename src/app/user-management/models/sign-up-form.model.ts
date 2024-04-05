import { FormControl } from '@angular/forms';

export type SignUp = {
	email: string | null;
	password: string | null;
};
export type SignUpForm = {
	[Property in keyof SignUp]: FormControl<SignUp[Property]>;
};
