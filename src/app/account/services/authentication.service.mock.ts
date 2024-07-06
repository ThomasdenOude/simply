import { Signal, signal, WritableSignal } from '@angular/core';

import { User } from '@angular/fire/auth';
import { AuthenticationMessages } from '../models/authentication-messages';

export class AuthenticationServiceMock {
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
	public sendEmailVerification = jest.fn(() => Promise.resolve());
	public creatUserAndVerifyEmail = jest.fn(() => Promise.resolve());
	public loginAndVerifyEmail = jest.fn(() => Promise.resolve(true));
	public getAuthenticationMessage = jest.fn(() => AuthenticationMessages.None);
	public changePassword = jest.fn(() => Promise.resolve());
	public sendPasswordReset = jest.fn(() => Promise.resolve());
}
