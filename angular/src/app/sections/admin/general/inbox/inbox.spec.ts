import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Inbox } from './inbox';

describe('Inbox', () => {
  let component: Inbox;
  let fixture: ComponentFixture<Inbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Inbox],
    }).compileComponents();

    fixture = TestBed.createComponent(Inbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
