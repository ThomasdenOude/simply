import {
	MockBuilder,
	MockedComponentFixture,
	MockedDebugElement,
	MockInstance,
	MockRender,
	ngMocks,
} from 'ng-mocks';

import { dataTest } from '../../../../test/helpers/data-test.helper';

import { PanelComponent } from './panel.component';
import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';
import { fakeAsync, tick } from '@angular/core/testing';
import { AuthenticationMessages } from '../../models/authentication-messages';
import { output, signal, Signal } from '@angular/core';

describe('MenuDropdownComponent', () => {
	let component: PanelComponent;
	let toggleButton: MockedDebugElement;
	const icon = 'test-icon';
	const title = 'test title';
	const params = {
		iconName: icon,
		panelTitle: title,
	};

	describe('Panel', () => {
		beforeEach(() => MockBuilder(PanelComponent));

		describe('No content', () => {
			beforeEach(() => {
				// Arrange
				const fixture = MockRender(PanelComponent, params);
				component = fixture.point.componentInstance;
				toggleButton = dataTest('toggle-button');
			});

			it('should set iconName and PanelTitle', () => {
				// Assert
				expect(component.iconName()).toBe(icon);
				expect(component.panelTitle()).toBe(title);
			});

			it('should emit panelOpened on togglePanel call', () => {
				// Arrange
				const fixture = MockRender(PanelComponent, params);
				component = fixture.point.componentInstance;

				let opened: boolean | undefined;
				component.panelOpened.subscribe(value => (opened = value));

				// Assert
				expect(opened).toBeUndefined();
				// Act
				toggleButton.nativeElement.click();
			});
		});
	});

	describe('Panel with ConfirmPassword', () => {
		beforeEach(() =>
			MockBuilder(PanelComponent).mock(ConfirmPasswordComponent)
		);

		it('should reset confirmPassword on panelClose', () => {
			// Arrange
			const fixture: MockedComponentFixture<PanelComponent> =
				MockRender<PanelComponent>(`
            <simply-panel panelTitle="test" iconName="home">
              <simply-confirm-password></simply-confirm-password>
            </simply-panel>
        `);
			component = fixture.point.componentInstance;
			const confirmPasswordComponent: MockedDebugElement<ConfirmPasswordComponent> =
				ngMocks.find(ConfirmPasswordComponent);
			const test: ConfirmPasswordComponent =
				confirmPasswordComponent.componentInstance;

			// Assert
			expect(confirmPasswordComponent).toBeTruthy();

			// if (component['confirmPassword']) {
			// 	spyReset = jest.spyOn(component['confirmPassword'], 'reset');
			//
			// 	// Assert
			// 	expect(spyReset).not.toHaveBeenCalled();
			//
			// 	// Act
			// 	component['togglePanel']();
			// 	// Assert
			// 	expect(component['panelIsOpened']()).toBe(true);
			// 	expect(spyReset).not.toHaveBeenCalled();
			//
			// 	// Act
			// 	component['togglePanel']();
			// 	// Assert
			// 	expect(component['panelIsOpened']()).toBe(false);
			// 	expect(spyReset).toHaveBeenCalledTimes(1);
			// }
		});
	});
});
