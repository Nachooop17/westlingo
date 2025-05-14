import { TestBed } from '@angular/core/testing';

import { GestureDetectionService } from './gesture-detection.service';

describe('GestureDetectionService', () => {
  let service: GestureDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestureDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
