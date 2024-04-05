import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPasswordFormFieldComponent } from './new-password-form-field.component';

describe('NewPasswordFormFieldComponent', () => {
  let component: NewPasswordFormFieldComponent;
  let fixture: ComponentFixture<NewPasswordFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPasswordFormFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPasswordFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
