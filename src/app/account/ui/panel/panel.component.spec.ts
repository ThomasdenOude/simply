import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';
import SpyInstance = jest.SpyInstance;

import { PanelComponent } from './panel.component';
import { ConfirmPasswordComponent } from '../confirm-password/confirm-password.component';

describe('MenuDropdownComponent', () => {
	let component: PanelComponent;
	const icon = 'test-icon';
	const title = 'test title';
	const params = {
		iconName: icon,
		panelTitle: title,
	};

	describe('Panel', () => {
		beforeEach(() => MockBuilder(PanelComponent));

		it('should set iconName and PanelTitle', () => {
			// Arrange
			const fixture = MockRender(PanelComponent, params);
			component = fixture.point.componentInstance;

			// Assert
			expect(component.iconName()).toBe(icon);
			expect(component.panelTitle()).toBe(title);
		});

		it('should emit panelOpened on togglePanel call', () => {
			// Arrange
			const fixture = MockRender(PanelComponent, params);
			component = fixture.point.componentInstance;
			const spyPanelOpened: SpyInstance = jest.spyOn(
				component.panelOpened,
				'emit'
			);

			// Assert
			expect(component['panelIsOpened']()).toBe(false);
			expect(spyPanelOpened).not.toHaveBeenCalled();

			// Act
			component['togglePanel']();

			// Assert
			expect(component['panelIsOpened']()).toBe(true);
			expect(spyPanelOpened).toHaveBeenCalledTimes(1);
			expect(spyPanelOpened).toHaveBeenCalledWith(true);

			// Act
			component['togglePanel']();

			// Assert
			expect(component['panelIsOpened']()).toBe(false);
			expect(spyPanelOpened).toHaveBeenCalledTimes(2);
			expect(spyPanelOpened).toHaveBeenCalledWith(false);
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
            <simply-panel panelTitle="test">
              <simply-confirm-password></simply-confirm-password>
            </simply-panel>
        `);
			component = fixture.point.componentInstance;
			let spyReset: SpyInstance;

			// Assert
			expect(component['confirmPassword']).toBeTruthy();

			if (component['confirmPassword']) {
				spyReset = jest.spyOn(component['confirmPassword'], 'reset');

				// Assert
				expect(spyReset).not.toHaveBeenCalled();

				// Act
				component['togglePanel']();
				// Assert
				expect(component['panelIsOpened']()).toBe(true);
				expect(spyReset).not.toHaveBeenCalled();

				// Act
				component['togglePanel']();
				// Assert
				expect(component['panelIsOpened']()).toBe(false);
				expect(spyReset).toHaveBeenCalledTimes(1);
			}
		});
	});
});
