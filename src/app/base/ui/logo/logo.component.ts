import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'simply-logo',
	standalone: true,
	imports: [MatIcon],
	templateUrl: './logo.component.html',
	styleUrl: './logo.component.scss',
})
export class LogoComponent {}
