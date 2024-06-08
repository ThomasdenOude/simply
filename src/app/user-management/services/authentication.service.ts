import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
	Auth,
	authState,
	createUserWithEmailAndPassword,
	deleteUser,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	User,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';

import { AuthenticationMessages } from '../models/authentication-messages';
import { authenticationErrorMap } from '../data/authentication-messages.map';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private auth: Auth = inject(Auth);

	private _authState: Signal<User | null | undefined> = toSignal(
		authState(this.auth)
	);
	private _isLoggedIn: Signal<boolean> = computed(() => !!this._authState());
	private _user: Signal<User | null> = computed(
		() => this._authState() ?? null
	);

	public get user(): Signal<User | null> {
		return this._user;
	}

	public get isLoggedIn(): Signal<boolean> {
		return this._isLoggedIn;
	}

	public async creatUser(email: string, password: string): Promise<void> {
		return createUserWithEmailAndPassword(this.auth, email, password).then(() =>
			Promise.resolve()
		);
	}

	public async login(email: string, password: string): Promise<void> {
		return signInWithEmailAndPassword(this.auth, email, password).then(() =>
			Promise.resolve()
		);
	}

	public logout(): Promise<void> {
		return signOut(this.auth);
	}

	public changePassword(user: User, newPassword: string): Promise<void> {
		return updatePassword(user, newPassword);
	}

	public deleteUser(user: User): Promise<void> {
		return deleteUser(user);
	}

	public getAuthenticationMessage(
		error: FirebaseError
	): AuthenticationMessages {
		const message: AuthenticationMessages | undefined =
			authenticationErrorMap.get(error.code);
		return message ?? AuthenticationMessages.Default;
	}
}
