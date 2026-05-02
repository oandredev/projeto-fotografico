import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSettings } from './about-settings';

describe('AboutSettings', () => {
  let component: AboutSettings;
  let fixture: ComponentFixture<AboutSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
