import {
	computed,
	inject,
	Injectable,
	Signal,
	signal,
	WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import {
	Auth,
	authState,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	deleteUser,
	User,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';

import {
	authenticationErrorMap,
	AuthenticationMessages,
} from '../models/authentication-messages';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private router: Router = inject(Router);
	private auth: Auth = inject(Auth);

	private _authState: Signal<User | null | undefined> = toSignal(
		authState(this.auth)
	);
	private _isLoggedIn: Signal<boolean> = computed(() => !!this._authState());
	private _user: Signal<User | null> = computed(
		() => this._authState() ?? null
	);
	private _authenticationMessage: WritableSignal<AuthenticationMessages> =
		signal(AuthenticationMessages.None);

	public get user(): Signal<User | null> {
		return this._user;
	}

	public get isLoggedIn(): Signal<boolean> {
		return this._isLoggedIn;
	}

	public get authenticationMessage(): Signal<AuthenticationMessages> {
		return this._authenticationMessage;
	}

	public creatUser(email: string, password: string): void {
		createUserWithEmailAndPassword(this.auth, email, password)
			.then(() => {
				// Signed up
				this.router.navigate(['/task-manager']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationMessage(error);
			});
	}

	public login(email: string, password: string): void {
		signInWithEmailAndPassword(this.auth, email, password)
			.then(() => {
				// Signed in
				this.router.navigate(['/task-manager']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationMessage(error);
			});
	}

	public logout(): void {
		signOut(this.auth)
			.then(() => {
				// Signed out
				this.router.navigate(['/sign-in']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationMessage(error);
			});
	}

	public deleteUser(user: User): Promise<void> {
		return deleteUser(user);
	}

	public updateAuthenticationMessage(message: AuthenticationMessages): void {
		this._authenticationMessage.set(message);
	}

	private setAuthenticationMessage(error: FirebaseError): void {
		const message: AuthenticationMessages | undefined =
			authenticationErrorMap.get(error.code);
		this._authenticationMessage.set(message ?? AuthenticationMessages.Default);
	}

	public resetAuthenticationError(): void {
		this._authenticationMessage.set(AuthenticationMessages.None);
	}
}
