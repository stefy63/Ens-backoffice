import { TestBed, inject } from '@angular/core/testing';

import { UnreadedMessageEmitterService } from './unreaded-message-emitter.service';

describe('UnreadedMessageEmitterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnreadedMessageEmitterService]
    });
  });

  it('should be created', inject([UnreadedMessageEmitterService], (service: UnreadedMessageEmitterService) => {
    expect(service).toBeTruthy();
  }));
});
