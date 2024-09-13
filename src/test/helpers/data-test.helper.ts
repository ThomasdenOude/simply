import { MockedDebugElement, ngMocks } from 'ng-mocks';

export const dataTest = (dataTestValue: string): MockedDebugElement =>
	ngMocks.find(['data-test', dataTestValue]);

export const dataTestIf = (dataTestValue: string): MockedDebugElement | false =>
	ngMocks.find(['data-test', dataTestValue], false);
