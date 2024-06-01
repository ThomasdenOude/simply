import { MockBuilder, MockedComponentFixture, MockRender } from 'ng-mocks';

import { SpaceContentDirective } from './space-content.directive';

describe('SpaceContentDirective', () => {
	let fixture: MockedComponentFixture<SpaceContentDirective>;
	const width = 'simply-space-content__width';
	const small = 'simply-space-content__small';
	const regular = 'simply-space-content__regular';
	const large = 'simply-space-content__large';

	beforeEach(() => MockBuilder(SpaceContentDirective));

	it('should add width and regular class by default', () => {
		// Arrange
		fixture = MockRender<SpaceContentDirective>(
			'<div simplySpaceContent></div>'
		);
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${width} ${regular}"`);
	});

	it('should add width and small class when input is "small"', () => {
		// Arrange
		fixture = MockRender<SpaceContentDirective>(
			'<div simplySpaceContent="small"></div>'
		);
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${width} ${small}"`);
	});

	it('should add width and regular class when input is "regular"', () => {
		// Arrange
		fixture = MockRender<SpaceContentDirective>(
			'<div simplySpaceContent="regular"></div>'
		);
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${width} ${regular}"`);
	});

	it('should add width and large class when input is "large"', () => {
		// Arrange
		fixture = MockRender<SpaceContentDirective>(
			'<div simplySpaceContent="large"></div>'
		);
		const innerHTML = fixture.nativeElement.innerHTML;
		// Assert
		expect(innerHTML).toContain(`class="${width} ${large}"`);
	});
});
