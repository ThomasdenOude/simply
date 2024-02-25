import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';
import { Auth, user, User, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private auth: Auth = inject(Auth);
  private user$: Observable<User | null> = user(this.auth);
  private authState$: Observable<User | null> = authState(this.auth)

  constructor() {
    this.authState$.subscribe(user => {
      console.log('Authstate: ', user);

    })
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log('Change: ', user);

      }
      else {
        console.log('Change, logout')
      }
    })
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
        const user = userCredential.user;
        console.log('Created user: ', userCredential);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  }

  public login(email: string, password: string): void {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Logged in: ', userCredential);

        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  public logout(): void {
    console.log('Logout service');

    signOut(this.auth).then(
      () => {
        console.log('Logged out succesfully');
      }
    )
      .catch(() => {
        console.log('Error during logout');

      })
  }
}
