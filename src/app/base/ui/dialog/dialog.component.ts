import { Component } from '@angular/core';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';

@Component({
	selector: 'simply-dialog',
	standalone: true,
	imports: [CdkPortalOutlet],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss',
	host: {
		class: 'simply-dialog__host',
	},
})
export class DialogComponent extends CdkDialogContainer {}
