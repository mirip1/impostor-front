import { TestBed } from '@angular/core/testing';

import { Socketservice } from './socketservice';

describe('Socketservice', () => {
  let service: Socketservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Socketservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
