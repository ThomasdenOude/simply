import { Signal, signal, WritableSignal } from '@angular/core';

import { User } from '@angular/fire/auth';

export class MockAuthenticationService {
	// Set mock return values for public methods
	public userSignal: WritableSignal<User | null> = signal(null);
	public isLoggedInSignal: WritableSignal<boolean> = signal(false);

	// Public methods
	public get user(): Signal<User | null> {
		return this.userSignal;
	}
	public get isLoggedIn(): Signal<boolean> {
		return this.isLoggedInSignal;
	}
	public logout = jest.fn(() => Promise.resolve());
}
