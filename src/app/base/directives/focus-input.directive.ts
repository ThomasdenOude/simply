import { AfterContentInit, Directive, inject } from '@angular/core';

import { MatInput } from '@angular/material/input';

@Directive({
	selector: 'input[matInput][simplyFocusInput]',
	standalone: true,
})
export class FocusInputDirective implements AfterContentInit {
	private matInput: MatInput = inject(MatInput);

	ngAfterContentInit() {
		this.matInput?.focus();
	}
}
