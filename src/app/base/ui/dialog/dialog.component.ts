import {
	Component,
	ElementRef,
	inject,
	OnInit,
	Renderer2,
} from '@angular/core';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';

@Component({
	selector: 'simply-dialog',
	standalone: true,
	imports: [CdkPortalOutlet],
	templateUrl: './dialog.component.html',
	styleUrl: './dialog.component.scss',
})
export class DialogComponent extends CdkDialogContainer implements OnInit {
	private elementRef: ElementRef = inject(ElementRef);
	private renderer: Renderer2 = inject(Renderer2);

	ngOnInit() {
		this.renderer.addClass(
			this.elementRef.nativeElement,
			'simply-dialog__host'
		);
	}
}
