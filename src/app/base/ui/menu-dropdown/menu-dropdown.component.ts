import {
	Component,
	EventEmitter,
	input,
	InputSignal,
	Output,
	signal,
	WritableSignal,
} from '@angular/core';

import { MatIcon } from '@angular/material/icon';

@Component({
	selector: 'app-menu-dropdown',
	standalone: true,
	imports: [MatIcon],
	templateUrl: './menu-dropdown.component.html',
	styleUrl: './menu-dropdown.component.scss',
})
export class MenuDropdownComponent {
	protected menuOpened: WritableSignal<boolean> = signal(false);

	public iconName: InputSignal<string | undefined> = input<string>();
	public menuTitle: InputSignal<string> = input.required<string>();

	@Output()
	public menuToggled: EventEmitter<void> = new EventEmitter<void>();

	protected toggleMenu(): void {
		this.menuOpened.update(() => !this.menuOpened());
		this.menuToggled.emit();
	}
}
