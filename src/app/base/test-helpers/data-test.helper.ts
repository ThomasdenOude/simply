import { MockedDebugElement, ngMocks } from 'ng-mocks';

const dataTest = (dataTestValue: string): MockedDebugElement =>
	ngMocks.find(['data-test', dataTestValue]);

const dataTestIf = (dataTestValue: string): MockedDebugElement | false =>
	ngMocks.find(['data-test', dataTestValue], false);

export { dataTest, dataTestIf };
