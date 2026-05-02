import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactSettings } from './contact-settings';

describe('ContactSettings', () => {
  let component: ContactSettings;
  let fixture: ComponentFixture<ContactSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
