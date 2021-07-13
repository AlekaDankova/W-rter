import { TestBed } from '@angular/core/testing';

import { SprachenService } from './sprachen.service';

describe('SprachenService', () => {
  let service: SprachenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SprachenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
