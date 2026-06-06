import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightBox } from './light-box';

describe('LightBox', () => {
  let component: LightBox;
  let fixture: ComponentFixture<LightBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightBox],
    }).compileComponents();

    fixture = TestBed.createComponent(LightBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
