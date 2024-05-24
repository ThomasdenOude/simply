import { ErrorStateMatcher } from '@angular/material/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';

export class SimplyErrorStateMatcher implements ErrorStateMatcher {
	public isErrorState(
		control: AbstractControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && isSubmitted);
	}
}
