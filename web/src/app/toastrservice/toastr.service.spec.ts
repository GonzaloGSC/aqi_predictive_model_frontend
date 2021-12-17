import { TestBed } from '@angular/core/testing';

import { toastrService } from './toastr.service';

describe('toastrService', () => {
  let service: toastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(toastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
