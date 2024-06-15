import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  deleteUser, sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User, UserCredential,
} from '@angular/fire/auth';
import { FirebaseError } from '@firebase/util';

import { AuthenticationMessages } from '../models/authentication-messages';
import { authenticationErrorMap } from '../data/authentication-messages.map';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private auth: Auth = inject(Auth);
  private baseUrl = environment.baseUrl;

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

  public emailVerified: Signal<boolean> = computed(() => this._user()?.emailVerified ?? false)

	public get isLoggedIn(): Signal<boolean> {
		return this._isLoggedIn;
	}

	public async creatUserAndVerifyEmail(email: string, password: string): Promise<void> {
		return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: UserCredential) => this.sendEmailVerification(userCredential.user));
	}

	public async loginAndVerifyEmail(email: string, password: string): Promise<boolean | void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential: UserCredential): Promise<boolean | void> => {
      const user: User = userCredential.user;

      if (user.emailVerified) {
        return Promise.resolve(true);
      } else {
        return this.sendEmailVerification(user);
      }
    })
  }

  public async sendEmailVerification(user: User): Promise<void> {
    return sendEmailVerification(user, {
      url: this.baseUrl + '/task-board'
    })
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
