import { AfterContentInit, Directive, inject } from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
	selector: 'input[matInput][appFocusInput]',
	standalone: true,
})
export class FocusInputDirective implements AfterContentInit {
	private matInput: MatInput = inject(MatInput);

	ngAfterContentInit() {
		console.log(this.matInput);
		this.matInput?.focus();
	}
}
