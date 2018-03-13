import { TestBed, inject } from '@angular/core/testing';

import { ApiTicketHistoryService } from './api-ticket-history.service';

describe('ApiTicketHistoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiTicketHistoryService]
    });
  });

  it('should be created', inject([ApiTicketHistoryService], (service: ApiTicketHistoryService) => {
    expect(service).toBeTruthy();
  }));
});
