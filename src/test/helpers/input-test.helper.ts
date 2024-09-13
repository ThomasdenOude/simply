import { MockedDebugElement } from 'ng-mocks';

export const inputTest = (debugElement: MockedDebugElement, value: string) => {
	debugElement.nativeElement.value = value;
	debugElement.nativeElement.dispatchEvent(new Event('input'));
};
