import {
	Component,
	ContentChild,
	EventEmitter,
	input,
	InputSignal,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';
import { ConfirmPasswordComponent } from '../../../user-management/ui/confirm-password/confirm-password.component';

@Component({
	selector: 'app-menu-dropdown',
	standalone: true,
	imports: [MatIcon],
	templateUrl: './menu-dropdown.component.html',
	styleUrl: './menu-dropdown.component.scss',
})
export class MenuDropdownComponent {
	protected menuIsOpened: WritableSignal<boolean> = signal(false);

	public iconName: InputSignal<string | undefined> = input<string>();
	public menuTitle: InputSignal<string> = input.required<string>();

	@ContentChild(ConfirmPasswordComponent)
	private confirmPassword?: ConfirmPasswordComponent;

	@Output()
	public menuOpened: EventEmitter<boolean> = new EventEmitter<boolean>();

	protected toggleMenu(): void {
		this.menuIsOpened.update(() => !this.menuIsOpened());
		this.menuOpened.emit(this.menuIsOpened());
		if (!this.menuIsOpened() && this.confirmPassword) {
			this.confirmPassword.reset();
		}
	}
}
