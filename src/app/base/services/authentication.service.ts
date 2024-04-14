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
	User,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';

import {
	authenticationErrorMap,
	AuthenticationErrors,
} from '../models/authentication-errors';

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
	private _authenticationError: WritableSignal<AuthenticationErrors> = signal(
		AuthenticationErrors.None
	);

	public get user(): Signal<User | null> {
		return this._user;
	}

	public get isLoggedIn(): Signal<boolean> {
		return this._isLoggedIn;
	}

	public get authenticationError(): Signal<AuthenticationErrors> {
		return this._authenticationError;
	}

	public creatUser(email: string, password: string): void {
		createUserWithEmailAndPassword(this.auth, email, password)
			.then(() => {
				// Signed up
				this.router.navigate(['/task-manager']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationError(error);
			});
	}

	public login(email: string, password: string): void {
		signInWithEmailAndPassword(this.auth, email, password)
			.then(() => {
				// Signed in
				this.router.navigate(['/task-manager']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationError(error);
			});
	}

	public logout(): void {
		signOut(this.auth)
			.then(() => {
				// Signed out
				this.router.navigate(['/sign-in']);
			})
			.catch((error: FirebaseError) => {
				this.setAuthenticationError(error);
			});
	}

	private setAuthenticationError(error: FirebaseError): void {
		const message: AuthenticationErrors | undefined =
			authenticationErrorMap.get(error.code);
		this._authenticationError.set(message ?? AuthenticationErrors.Default);
	}

	public resetAuthenticationError(): void {
		this._authenticationError.set(AuthenticationErrors.None);
	}
}
