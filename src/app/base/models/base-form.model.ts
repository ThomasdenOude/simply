import { FormControl } from '@angular/forms';

export type BaseForm<T> = {
	[Property in keyof T]: FormControl<T[Property]>;
};
