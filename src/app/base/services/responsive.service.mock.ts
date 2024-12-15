import { computed, Signal, signal, WritableSignal } from '@angular/core';

import { Devices } from '../models/devices.model';

export class ResponsiveServiceMock {
	public deviceSignal: WritableSignal<Devices> = signal(Devices.Unknown);

	public device: Signal<Devices> = computed(() => this.deviceSignal());
}
