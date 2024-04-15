import { Component, inject } from '@angular/core';
import {
	MatDialogActions,
	MatDialogContent,
	MatDialogRef,
	MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'app-remove-account',
	standalone: true,
	imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
	templateUrl: './remove-account.component.html',
	styleUrl: './remove-account.component.scss',
})
export class RemoveAccountComponent {
	private dialogRef: MatDialogRef<RemoveAccountComponent, boolean> = inject(
		MatDialogRef<RemoveAccountComponent>
	);

	protected cancel(): void {
		this.dialogRef.close(false);
	}

	protected removeAccount(): void {
		this.dialogRef.close(true);
	}
}
