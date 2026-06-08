import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomer } from './update-customer';

describe('AddCustomer', () => {
  let component: UpdateCustomer;
  let fixture: ComponentFixture<UpdateCustomer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCustomer],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCustomer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
