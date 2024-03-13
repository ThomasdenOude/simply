import { Injectable, Signal, computed, inject } from '@angular/core';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';

import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { Devices } from '../models/devices';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  private breakpointObserver: BreakpointObserver = inject(BreakpointObserver);
  private breakpointState$: Observable<BreakpointState> = this.breakpointObserver.observe(
    Breakpoints.HandsetLandscape
  )
  private breakpointState: Signal<BreakpointState | undefined> = toSignal(this.breakpointState$);

  public device: Signal<Devices> = computed(() => {
    const breakpoints = this.breakpointState()?.breakpoints;
    if (breakpoints) {
      if (breakpoints[Breakpoints.HandsetLandscape]) {
        return Devices.HandsetLandscape;
      }
    }
    return Devices.Unknown
  })
}
