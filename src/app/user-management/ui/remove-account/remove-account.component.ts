import { Component, inject, Signal } from '@angular/core';
import {
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ResponsiveService } from '../../../base/services/responsive.service';
import { Devices } from '../../../base/models/devices';

@Component({
	selector: 'simply-remove-account',
	standalone: true,
	imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
	templateUrl: './remove-account.component.html',
	styleUrl: './remove-account.component.scss',
})
export class RemoveAccountComponent {
	private responsiveService: ResponsiveService = inject(ResponsiveService);
	private dialogRef: MatDialogRef<RemoveAccountComponent, boolean> = inject(
		MatDialogRef<RemoveAccountComponent>
	);

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
