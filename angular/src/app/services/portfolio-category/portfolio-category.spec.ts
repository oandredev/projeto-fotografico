import { TestBed } from '@angular/core/testing';

import { PortfolioCategoryService } from './portfolio-category';

describe('PortfolioCategoryService', () => {
  let service: PortfolioCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
