import { Router, RouterModule } from '@angular/router';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { Dialog } from '@angular/cdk/dialog';
import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockRender,
	NG_MOCKS_ROOT_PROVIDERS,
} from 'ng-mocks';
import { mock, MockProxy } from 'jest-mock-extended';
import { User } from '@angular/fire/auth';

import {
	dataTest,
	dataTestIf,
} from '../../../jest/test-helpers/data-test.helper';
import { RouterMock } from '../../../jest/test-mocks/router.mock';
import { AuthenticationServiceMock } from '../../services/authentication-service/authentication.service.mock';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { SettingsComponent } from './settings.component';
import { CenterPageComponent } from '../../../base/ui/center-page/center-page.component';
import { PanelComponent } from '../../ui/panel/panel.component';
import { MessageComponent } from '../../../base/ui/message/message.component';
import { ConfirmPasswordComponent } from '../../ui/confirm-password/confirm-password.component';
import { NewPasswordComponent } from '../../ui/new-password/new-password.component';
import { AuthenticationMessages } from '../../models/authentication-messages';

describe('SettingsComponent', () => {
	let fixture: MockedComponentFixture<SettingsComponent>;
	let component: SettingsComponent;

	const mockRouter: RouterMock = new RouterMock();
	const mockAuthenticationService: AuthenticationServiceMock =
		new AuthenticationServiceMock();
	const mockUser: MockProxy<User> = mock<User>({
		email: 'mock@mail.com',
	});
	const mockPassword = 'mockPassword';

	let logoutButton: MockedDebugElement;
	let changePasswordPanel: MockedDebugElement<PanelComponent>;
	let removeAccountPanel: MockedDebugElement<PanelComponent>;
	let authenticationService: AuthenticationService;
	let router: Router;

	beforeEach(() =>
		MockBuilder(
			[SettingsComponent, RouterModule, NG_MOCKS_ROOT_PROVIDERS],
			[
				AuthenticationService,
				Router,
				Dialog,
				CenterPageComponent,
				PanelComponent,
				MessageComponent,
				ConfirmPasswordComponent,
				NewPasswordComponent,
			]
		)
			.mock(AuthenticationService, mockAuthenticationService)
			.mock(Router, mockRouter)
	);

	beforeEach(() => {
		fixture = MockRender(SettingsComponent);
		component = fixture.point.componentInstance;
		fixture.detectChanges();

		mockAuthenticationService.userSignal.set(mockUser);

		authenticationService = TestBed.inject(AuthenticationService);
		router = TestBed.inject(Router);

		logoutButton = dataTest('logout-button');
		changePasswordPanel = dataTest('change-password-panel');
		removeAccountPanel = dataTest('remove-account-panel');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('shows both panels', () => {
		// Assert
		expect(changePasswordPanel.componentInstance.iconName).toBe('password');
		expect(changePasswordPanel.componentInstance.panelTitle).toBe(
			'Change password'
		);
		expect(removeAccountPanel.componentInstance.iconName).toBe('delete');
		expect(removeAccountPanel.componentInstance.panelTitle).toBe(
			'Remove account'
		);
	});

	it('logs user out', () => {
		// Act
		logoutButton.nativeElement.click();
		fixture.detectChanges();
		// Assert
		expect(authenticationService.logout).toHaveBeenCalledTimes(1);
		expect(router.navigate).toHaveBeenCalledTimes(1);
		expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
	});

	describe('Change password', () => {
		let changePasswordMessage: MockedDebugElement | false;
		let confirmPassword: MockedDebugElement<ConfirmPasswordComponent>;
		let newPassword: MockedDebugElement | false;

		beforeEach(() => {
			changePasswordMessage = dataTestIf('change-password-message');
			confirmPassword = dataTest('confirm-password-for-change');
			newPassword = dataTestIf('new-password');
		});

		it('changes the password', fakeAsync(() => {
			// Assert
			expect(changePasswordMessage).toBe(false);
			expect(newPassword).toBe(false);
			expect(confirmPassword).toBeTruthy();
			// Act
			confirmPassword.componentInstance.onPasswordSubmit.emit(mockPassword);
			tick();
			fixture.detectChanges();
			// Assert
			expect(authenticationService.loginAndVerifyEmail).toHaveBeenCalledTimes(
				1
			);
			expect(authenticationService.loginAndVerifyEmail).toHaveBeenCalledWith(
				mockUser.email,
				mockPassword
			);
			// Arrange
			const newPasswordAfterConfirm: MockedDebugElement<NewPasswordComponent> =
				dataTest('new-password');
			// Assert
			expect(newPasswordAfterConfirm.componentInstance.newPasswordTitle).toBe(
				'Change your password'
			);
			expect(
				newPasswordAfterConfirm.componentInstance.newPasswordSubmitAction
			).toBe('Change password');
			// Act
			newPasswordAfterConfirm.componentInstance.isSubmitted.emit('newPassword');
			tick();
			fixture.detectChanges();
			// Assert
			expect(authenticationService.changePassword).toHaveBeenCalledTimes(1);
			expect(authenticationService.changePassword).toHaveBeenCalledWith(
				mockUser,
				'newPassword'
			);
			// Arrange
			const newPasswordAfterSubmit = dataTestIf('new-password');
			const confirmPasswordAfterSubmit = dataTestIf(
				'confirm-password-for-change'
			);
			const successMessage: MockedDebugElement<MessageComponent> = dataTest(
				'change-password-message'
			);
			// Assert
			expect(newPasswordAfterSubmit).toBe(false);
			expect(confirmPasswordAfterSubmit).toBe(false);
			expect(successMessage.componentInstance.errorMessage).toBe(
				AuthenticationMessages.SuccessfulPasswordChange
			);
		}));
	});
});
