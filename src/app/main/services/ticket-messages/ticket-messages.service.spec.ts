import { TestBed, inject } from '@angular/core/testing';

import { TicketMessagesService } from './ticket-messages.service';

describe('TicketMessagesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketMessagesService]
    });
  });

  it('should be created', inject([TicketMessagesService], (service: TicketMessagesService) => {
    expect(service).toBeTruthy();
  }));
});
