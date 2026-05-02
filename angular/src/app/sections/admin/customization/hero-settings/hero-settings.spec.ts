import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSettings } from './hero-settings';

describe('HeroSettings', () => {
  let component: HeroSettings;
  let fixture: ComponentFixture<HeroSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
