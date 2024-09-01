import { Router, RouterModule } from '@angular/router';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { User } from '@angular/fire/auth';

import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';

import { dataTest } from '../../../jest/test-helpers/data-test.helper';
import { RouterMock } from '../../../jest/test-mocks/router.mock';
import { AuthenticationServiceMock } from '../../services/authentication-service/authentication.service.mock';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { VisibilityChangesService } from '../../services/visibility-changes.service';
import { VerifyEmailComponent } from './verify-email.component';
import { signal } from '@angular/core';

describe('VerifyEmailComponent', () => {
	let component: VerifyEmailComponent;
	let fixture: MockedComponentFixture<VerifyEmailComponent>;
	const mockUser: MockProxy<User> = mock<User>({
		email: 'mock@mail.com',
	});
	const mockRouter: RouterMock = new RouterMock();
	const mockAuthService: AuthenticationServiceMock =
		new AuthenticationServiceMock();

	beforeEach(() =>
		MockBuilder(
			[VerifyEmailComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[AuthenticationService, VisibilityChangesService]
		)
			.mock(AuthenticationService, mockAuthService)
			.mock(Router, mockRouter)
			.mock(VisibilityChangesService, {
				browserTabReturned: signal(true),
			})
	);

	describe('Verify email', () => {
		beforeEach(() => {
			fixture = MockRender(VerifyEmailComponent);
			component = fixture.point.componentInstance;
			mockAuthService.userSignal.set(mockUser);
			fixture.detectChanges();
		});

		it('shows user email', () => {
			// Arrange
			const title = dataTest('verify-email-title');
			const text = dataTest('verify-email-text');
			// Assert
			expect(component).toBeTruthy();
			expect(title.nativeElement.textContent).toBe('Verify your email');
			expect(text.nativeElement.textContent).toContain(mockUser.email);
		});

		describe('Email verification', () => {
			let sendVerificationButton: MockedDebugElement;
			let authService: AuthenticationService;
			let router: Router;

			beforeEach(() => {
				// Arrange
				sendVerificationButton = dataTest('send-verification-button');
				authService = TestBed.inject(AuthenticationService);
				router = TestBed.inject(Router);
			});

			afterEach(() => {
				jest.resetAllMocks();
			});

			it('sends email verification', () => {
				// Act
				sendVerificationButton.nativeElement.click();
				// Assert
				expect(authService.sendEmailVerification).toHaveBeenCalledTimes(1);
				expect(authService.sendEmailVerification).toHaveBeenCalledWith(
					mockUser
				);
			});

			it('does not send email verification if no user provided', () => {
				// Act
				mockAuthService.userSignal.set(null);
				sendVerificationButton.nativeElement.click();
				// Assert
				expect(authService.sendEmailVerification).not.toHaveBeenCalled();
			});
		});
	});
});
