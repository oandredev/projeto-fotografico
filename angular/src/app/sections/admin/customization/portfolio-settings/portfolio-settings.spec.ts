import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioSettings } from './portfolio-settings';

describe('PortfolioSettings', () => {
  let component: PortfolioSettings;
  let fixture: ComponentFixture<PortfolioSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
