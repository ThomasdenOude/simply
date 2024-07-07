import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVerifyEmailComponent } from './confirm-verify-email.component';

describe('ConfirmVerifyEmailComponent', () => {
  let component: ConfirmVerifyEmailComponent;
  let fixture: ComponentFixture<ConfirmVerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmVerifyEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmVerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
