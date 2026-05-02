import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCode } from './verify-code';

describe('VerifyCode', () => {
  let component: VerifyCode;
  let fixture: ComponentFixture<VerifyCode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCode],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyCode);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
