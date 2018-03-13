import { TestBed, inject } from '@angular/core/testing';

import { ReactiveHttpClientService } from './reactive-http-client.service';

describe('ReactiveHttpClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReactiveHttpClientService]
    });
  });

  it('should be created', inject([ReactiveHttpClientService], (service: ReactiveHttpClientService) => {
    expect(service).toBeTruthy();
  }));
});
