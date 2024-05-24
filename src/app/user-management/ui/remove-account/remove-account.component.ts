import { Component, inject, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { Devices } from '../../../base/models/devices';
import { DialogRef } from '@angular/cdk/dialog';
import { TextContentDirective } from '../../../base/directives/text-content.directive';

@Component({
	selector: 'simply-remove-account',
	standalone: true,
	imports: [MatButton, TextContentDirective],
	templateUrl: './remove-account.component.html',
	styleUrl: './remove-account.component.scss',
})
export class RemoveAccountComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);

	protected Devices = Devices;

	protected device: Signal<Devices>;

	constructor() {
		this.device = this.responsiveService.device;
	}

	protected cancel(): void {
		this.dialogRef.close(false);
	}

	protected removeAccount(): void {
		this.dialogRef.close(true);
	}
}
