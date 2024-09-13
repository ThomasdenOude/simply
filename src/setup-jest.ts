import 'jest-preset-angular/setup-jest';

import { CommonModule } from '@angular/common';
import { ApplicationModule } from '@angular/core';
import { DefaultTitleStrategy, TitleStrategy } from '@angular/router';
import {
	BrowserAnimationsModule,
	NoopAnimationsModule,
} from '@angular/platform-browser/animations';

import { ngMocks, MockService } from 'ng-mocks';
import { ReactiveFormsModule } from '@angular/forms';

ngMocks.autoSpy('jest');
ngMocks.globalKeep(ApplicationModule, true);
ngMocks.globalKeep(CommonModule, true);
ngMocks.globalKeep(ReactiveFormsModule, true);

ngMocks.defaultMock(TitleStrategy, () => MockService(DefaultTitleStrategy));
ngMocks.globalReplace(BrowserAnimationsModule, NoopAnimationsModule);
