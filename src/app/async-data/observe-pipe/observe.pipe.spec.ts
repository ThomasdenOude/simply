import { Component, DebugElement, EventEmitter } from '@angular/core';
import {
	ComponentFixture,
	fakeAsync,
	TestBed,
	tick,
} from '@angular/core/testing';

import {
	delay,
	finalize,
	interval,
	map,
	of,
	Subject,
	Subscribable,
	switchMap,
	throwError,
} from 'rxjs';
import { ngMocks } from 'ng-mocks';

import { ObservePipe } from './observe.pipe';
import { dataTestIf } from '../../test/helpers/data-test.helper';

@Component({
	selector: 'test',
	template: `
    @let value = value$ | observe;

    @if (value?.loading) {
      <p data-test="loading">Loading</p>
    }
    @if (value?.empty) {
      <p data-test="empty">Empty</p>
    }
    @if (isArrayValue(value?.data)) {
      @for (data of value?.data; track data) {
        <p data-test="data">{{ data }}</p>
      }
    } @else if (value?.data != undefined) {
      <p data-test="data">{{ value?.data }}</p>
    }
    @if (value?.error) {
      <p data-test="error">{{ value.error.message }}</p>
    }
  `,
	standalone: true,
	imports: [ObservePipe],
})
class TestComponent {
	public value$:
		| Subscribable<any>
		| Promise<any>
		| EventEmitter<any>
		| undefined;

	protected isArrayValue(value: any): boolean {
		return Array.isArray(value);
	}
}

describe('ObservePipe', () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;
	let loading: DebugElement | boolean;
	let empty: DebugElement | boolean;
	let data: DebugElement[];
	let error: DebugElement | boolean;

	const getElements = () => {
		loading = dataTestIf('loading');
		empty = dataTestIf('empty');
		data = ngMocks.findAll(fixture, '[data-test="data"]');
		error = dataTestIf('error');
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TestComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('shows nothing if value$ is undefined', () => {
		getElements();
		// Assert
		expect(loading).toBe(false);
		expect(empty).toBe(false);
		expect(data.length).toBe(0);
		expect(error).toBe(false);
	});

	describe('Observables', () => {
		it('shows loading stated until data is received', fakeAsync(() => {
			// Arrange
			testComponent.value$ = of('test').pipe(delay(1000));
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBeTruthy();
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBe(false);

			tick(1000);
			fixture.detectChanges();
			getElements();
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toEqual('test');
			expect(error).toBe(false);
		}));

		it('shows empty state if value$ is empty Observable', () => {
			// Arrange
			testComponent.value$ = of(undefined);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBeTruthy();
			expect(data.length).toBe(0);
			expect(error).toBe(false);
		});

		it('shows data if value$ is falsy value', () => {
			// Arrange
			testComponent.value$ = of(0);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data[0].nativeElement.textContent).toEqual('0');
			expect(error).toBe(false);
		});

		it('shows empty state if value$ is empty array Observable', () => {
			// Arrange
			testComponent.value$ = of([]);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBeTruthy();
			expect(data.length).toBe(0);
			expect(error).toBe(false);
		});

		it('shows error state', () => {
			// Arrange
			testComponent.value$ = throwError(() => new Error('test error'));
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBeTruthy();
			expect((error as DebugElement).nativeElement.textContent).toEqual(
				'test error'
			);
		});

		it('updates values', fakeAsync(() => {
			const testValues = ['one', 'two'];
			testComponent.value$ = interval(1000).pipe(
				map(index => testValues[index]),
				switchMap(text =>
					text ? of(text) : throwError(() => new Error('test error'))
				)
			);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBeTruthy();
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBe(false);

			tick(1000);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toBe('one');
			expect(error).toBe(false);

			tick(1000);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toBe('two');
			expect(error).toBe(false);

			tick(1000);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBeTruthy();
			expect((error as DebugElement).nativeElement.textContent).toEqual(
				'test error'
			);
		}));

		it('shows list of data', () => {
			testComponent.value$ = of(['one', 'two', 'three']);
			fixture.detectChanges();
			getElements();
			// Assert
			expect(data.length).toBe(3);
			expect(data[2].nativeElement.textContent).toEqual('three');
		});

		it('shows loading state after switching to new observable', fakeAsync(() => {
			// Arrange
			testComponent.value$ = of('one');
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(data[0].nativeElement.textContent).toBe('one');
			// Arrange
			testComponent.value$ = of('two').pipe(delay(1000));
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBeTruthy();
			// Arrange
			tick(1000);
			fixture.detectChanges();
			getElements();
			expect(loading).toBe(false);
			expect(data[0].nativeElement.textContent).toBe('two');
		}));

		it('unsubscribes observable when switching to second observable', () => {
			let subjectUnsubscribed = false;
			const subject = new Subject();
			testComponent.value$ = subject
				.asObservable()
				.pipe(finalize(() => (subjectUnsubscribed = true)));
			fixture.detectChanges();
			expect(subjectUnsubscribed).toBe(false);
			// Act
			subject.next('one');
			fixture.detectChanges();
			getElements();
			expect(data[0].nativeElement.textContent).toBe('one');
			expect(subjectUnsubscribed).toBe(false);
			// Act
			testComponent.value$ = of('two');
			fixture.detectChanges();
			getElements();
			expect(data[0].nativeElement.textContent).toBe('two');
			expect(subjectUnsubscribed).toBe(true);
		});

		it('unsubscribes observable when component is destroyed', () => {
			let subjectUnsubscribed = false;
			const subject = new Subject();
			testComponent.value$ = subject
				.asObservable()
				.pipe(finalize(() => (subjectUnsubscribed = true)));
			fixture.detectChanges();
			expect(subjectUnsubscribed).toBe(false);
			// Act
			fixture.destroy();
			// Assert
			expect(subjectUnsubscribed).toBe(true);
		});
	});

	describe('Promises', () => {
		it('shows value from promise', fakeAsync(() => {
			// Arrange
			testComponent.value$ = Promise.resolve('one');
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toBe('one');
			expect(error).toBe(false);
		}));

		it('shows error from promise', fakeAsync(() => {
			// Arrange
			testComponent.value$ = Promise.reject(new Error('test error'));
			fixture.detectChanges();
			tick();
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBeTruthy();
			expect((error as DebugElement).nativeElement.textContent).toEqual(
				'test error'
			);
		}));

		it('shows loading stated until promise is resolved', fakeAsync(() => {
			// Arrange
			testComponent.value$ = new Promise(resolve => {
				setTimeout(() => resolve('test'), 1000);
			});
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBeTruthy();
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBe(false);

			tick(1000);
			fixture.detectChanges();
			getElements();
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toEqual('test');
			expect(error).toBe(false);
		}));
	});

	describe('EventEmitters', () => {
		it('shows value from event emitter', () => {
			// Arrange
			const eventEmitter = new EventEmitter();
			testComponent.value$ = eventEmitter;
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBeTruthy();
			expect(empty).toBe(false);
			expect(data.length).toBe(0);
			expect(error).toBe(false);

			// Act
			eventEmitter.emit('test');
			fixture.detectChanges();
			getElements();
			// Assert
			expect(loading).toBe(false);
			expect(empty).toBe(false);
			expect(data.length).toBe(1);
			expect(data[0].nativeElement.textContent).toEqual('test');
			expect(error).toBe(false);
		});
	});
});
