import { AuthPipe, } from '@angular/fire/auth-guard';
import { User } from '@angular/fire/auth';

import { map } from 'rxjs';

export const VERIFY_EMAIL_ROUTE: string[] = ['/account', 'verify-email'];
export const TASK_BOARD_ROUTE: string[] = ['/task-board'];
export const WELCOME_ROUTE: string[] =  ['/'];


export const redirectAfterLogin: () => AuthPipe = () => map((userData: User | null): boolean | string[] => {
  if (userData) {
    return userData.emailVerified ? TASK_BOARD_ROUTE : VERIFY_EMAIL_ROUTE
  }
  return true
})
export const redirectNotAuthorized:() => AuthPipe = () =>  map((userData: User | null): boolean | string[] => {
    if (userData) {
      return userData.emailVerified ? true : VERIFY_EMAIL_ROUTE
    }
    return WELCOME_ROUTE
  }
)
export const redirectVerified: () => AuthPipe = () => map((userData: User | null): boolean | string[] => {
  if (userData) {
    return userData.emailVerified ? TASK_BOARD_ROUTE : true;
  }
  return WELCOME_ROUTE;
})
