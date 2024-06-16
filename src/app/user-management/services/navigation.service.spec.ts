import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { NavigationService } from './navigation.service';
import { MockBuilder, MockRender } from 'ng-mocks';
import SpyInstance = jest.SpyInstance;

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => MockBuilder(NavigationService));

  beforeEach(() => {
    service = MockRender(NavigationService).point.componentInstance;
  })

  it('should not return if no visibility changes', fakeAsync(() => {
    let result
    service.browserTabReturned$.subscribe(returned => {
      result = returned
    })
    tick()
    expect(result).toBe(undefined);
  }));
});
