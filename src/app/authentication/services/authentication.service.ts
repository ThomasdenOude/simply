import { Injectable, inject, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router';

import { Auth, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private router: Router = inject(Router);
  private auth: Auth = inject(Auth);

  private _authState: Signal<User | null | undefined> = toSignal(authState(this.auth));
  private _isLoggedIn: Signal<boolean> = computed(() => !!this._authState())
  private _user: Signal<User | null> = computed(() => this._authState() ?? null)

  public get user(): Signal<User | null> {
    return this._user;
  }

  public get isLoggedIn(): Signal<boolean> {
    return this._isLoggedIn;
  }

  public creatUser(email: string, password: string): void {

    createUserWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        // Signed up 
        this.router.navigate(['/task-manager'])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public login(email: string, password: string): void {

    signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        // Signed in 
        this.router.navigate(['/task-manager'])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public logout(): void {

    signOut(this.auth)
      .then(() => {
        // Signed out
        this.router.navigate(['/sign-in'])
      }
      )
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      })
  }
}
