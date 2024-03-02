import { Injectable, WritableSignal, signal, inject, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';
import { Auth, user, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private router: Router = inject(Router);
  private auth: Auth = inject(Auth);

  private authState$: Observable<User | null> = authState(this.auth)
  private authState: Signal<User | null | undefined> = toSignal(this.authState$);

  public get user(): Signal<User | null> {
    return computed(() => this.authState() ?? null)
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this.authState$.pipe(
      map((user: User | null) => !!user)
    )
  }

  public creatUser(email: string, password: string): void {

    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed up 
        userCredential.user
        this.router.navigate(['/task-manager'])
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
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
