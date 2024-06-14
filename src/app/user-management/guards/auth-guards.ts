import { AuthPipe, } from '@angular/fire/auth-guard';
import { User } from '@angular/fire/auth';

import { map } from 'rxjs';

export const redirectNotAuthorizedGenerator: (redirect: string | any[]) => AuthPipe =
  (redirect) => map((userData: User | null) => {
    let notVerifiedPage;
    let notLoggedInPage
    if (Array.isArray(redirect)) {
      notLoggedInPage = redirect[0];
      notVerifiedPage = redirect[1];
    } else {
      notLoggedInPage = notVerifiedPage = redirect;
    }
    if (userData) {
      return userData.emailVerified ? true : notVerifiedPage
    }
    return notLoggedInPage
  }
)

export const redirectAfterLoginGenerator: (redirect: string | any[]) => AuthPipe = (redirect) => map((userData: User | null) => {
  let loggedInPage;
  let notVerifiedPage;
  if (Array.isArray(redirect)) {
    loggedInPage = redirect[0];
    notVerifiedPage = redirect[1];
  } else {
    loggedInPage = notVerifiedPage = redirect;
  }
  if (userData) {
    return userData.emailVerified ? loggedInPage : notVerifiedPage;
  }
  return true
})

export const redirectVerifiedGenerator: (redirect: string | any[]) => AuthPipe = (redirect) => map((userData: User | null) => {
  let loggedInPage;
  let notLoggedInPage;
  if (Array.isArray(redirect)) {
    loggedInPage = redirect[0];
    notLoggedInPage = redirect[1];
  } else {
    loggedInPage = notLoggedInPage = redirect;
  }
  if (userData) {
    return userData.emailVerified ? loggedInPage : true;
  }
  return notLoggedInPage;
})
