import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, map } from 'rxjs';
import { Auth, user, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private router: Router = inject(Router);
  private auth: Auth = inject(Auth);

  private user$: Observable<User | null> = user(this.auth);
  private authState$: Observable<User | null> = authState(this.auth)

  public get isLoggedIn$(): Observable<boolean> {
    return this.authState$.pipe(
      map((user: User | null) => !!user)
    )
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
