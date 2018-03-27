import { TestBed, inject } from '@angular/core/testing';

import { ApiLoginService } from './api-login.service';

describe('ApiLoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiLoginService]
    });
  });

  it('should be created', inject([ApiLoginService], (service: ApiLoginService) => {
    expect(service).toBeTruthy();
  }));
});
