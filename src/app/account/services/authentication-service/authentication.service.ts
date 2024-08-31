import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
	applyActionCode,
	Auth,
	authState,
	confirmPasswordReset,
	createUserWithEmailAndPassword,
	deleteUser,
	sendEmailVerification,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
	updatePassword,
	User,
	UserCredential,
	verifyPasswordResetCode,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';

import { AuthenticationMessages } from '../../models/authentication-messages';
import { authenticationErrorMap } from '../../data/authentication-messages.map';

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

	public async creatUserAndVerifyEmail(
		email: string,
		password: string
	): Promise<void> {
		return createUserWithEmailAndPassword(this.auth, email, password).then(
			(userCredential: UserCredential) => {
				return this.sendEmailVerification(userCredential.user);
			}
		);
	}

	public async loginAndVerifyEmail(
		email: string,
		password: string
	): Promise<boolean | void> {
		return signInWithEmailAndPassword(this.auth, email, password).then(
			(userCredential: UserCredential): Promise<boolean | void> => {
				const user: User = userCredential.user;

				if (user.emailVerified) {
					return Promise.resolve(true);
				} else {
					return this.sendEmailVerification(user);
				}
			}
		);
	}

	public async sendEmailVerification(user: User): Promise<void> {
		return sendEmailVerification(user);
	}

	public async confirmEmailVerification(actionCode: string): Promise<void> {
		return applyActionCode(this.auth, actionCode);
	}

	public sendPasswordReset(email: string): Promise<void> {
		return sendPasswordResetEmail(this.auth, email);
	}

	public verifyPasswordReset(actionCode: string): Promise<string> {
		return verifyPasswordResetCode(this.auth, actionCode);
	}

	public confirmPasswordReset(
		actionCode: string,
		password: string
	): Promise<void> {
		return confirmPasswordReset(this.auth, actionCode, password);
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
