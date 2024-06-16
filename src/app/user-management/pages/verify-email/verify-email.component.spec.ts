import { MockBuilder, MockedComponentFixture, MockRender, NG_MOCKS_ROOT_PROVIDERS } from 'ng-mocks';

import { VerifyEmailComponent } from './verify-email.component';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { NavigationService } from '../../services/navigation.service';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '@angular/fire/auth';
import { computed, signal, WritableSignal } from '@angular/core';
import SpyInstance = jest.SpyInstance;
import { MockRouter } from '../../../base/test-mocks/mock-router';
import { of } from 'rxjs';
import { fakeAsync, tick } from '@angular/core/testing';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: MockedComponentFixture<VerifyEmailComponent>;
  const mockUser: MockProxy<User> = mock<User>();
  const mockUserSignal: WritableSignal<User | null> = signal(mockUser);
  const mockRouter: MockRouter = new MockRouter();

  beforeEach(() => MockBuilder(
    [VerifyEmailComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
    [AuthenticationService, NavigationService]
    )
    .mock(AuthenticationService, {
      user: computed(() => mockUserSignal())
    })
    .mock(Router, mockRouter)
    .mock(NavigationService, {
      browserTabReturned$: of(null)
    })
);

  describe('Verify email', () => {
    beforeEach(() => {
      fixture = MockRender(VerifyEmailComponent);
      component = fixture.point.componentInstance;
    })

    it('should create', () => {
      expect(component['user']()).toBe(mockUser);
      expect(component['email']()).toBe(mockUser.email);
    });

    it('should null', () => {

    });

    it('should send email verification', fakeAsync(() => {
      const spySendEmail: SpyInstance = jest
        .spyOn(component['authService'], 'sendEmailVerification')
        .mockReturnValue(Promise.resolve())
      const spyNavigate: SpyInstance = jest.spyOn(component['router'], 'navigate');
      // Act
      component['sendVerificationLink']();
      tick()
      // Assert
      expect(spySendEmail).toHaveBeenCalledTimes(1);
      expect(spySendEmail).toHaveBeenCalledWith(mockUser);
      expect(spyNavigate).toHaveBeenCalledTimes(1);
      expect(spyNavigate).toHaveBeenCalledWith(['/task-board'])
    }));

    it('should not send email verification if no user provided', fakeAsync(() => {
      // Arrange
      mockUserSignal.set(null);
      const spySendEmail: SpyInstance = jest
        .spyOn(component['authService'], 'sendEmailVerification')
        .mockReturnValue(Promise.resolve())
      // Act
      component['sendVerificationLink']();
      tick()
      // Assert
      expect(spySendEmail).not.toHaveBeenCalled();
    }));
  })
});
