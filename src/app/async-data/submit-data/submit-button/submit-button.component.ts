import {
	Component,
	input,
	InputSignal,
	model,
	ModelSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPrefix } from '@angular/material/form-field';

@Component({
    selector: 'simply-submit-button',
    imports: [
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatPrefix,
    ],
    templateUrl: './submit-button.component.html',
    styleUrl: './submit-button.component.scss'
})
export class SubmitButtonComponent {
	public isLoading: ModelSignal<boolean> = model<boolean>(false);
	public buttonLabel: InputSignal<string> = input<string>('Save');
}
