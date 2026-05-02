import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomer } from './add-customer';

describe('AddCustomer', () => {
  let component: AddCustomer;
  let fixture: ComponentFixture<AddCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCustomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
