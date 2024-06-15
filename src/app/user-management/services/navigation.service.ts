import { Injectable } from '@angular/core';
import { filter, fromEvent, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _visibilityChange$: Observable<Event> = fromEvent(document, 'visibilitychange');

  public get browserTabReturned$(): Observable<null> {
    let redirected = false;

    return this._visibilityChange$.pipe(
      map(() => {
        if (document.hidden) {
          redirected = true;
          return false;
        } else {
          return redirected
        }
      }),
      filter(returned => returned),
      map(() => null),
      take(1)
    )
  }
}
