import { TestBed, inject } from '@angular/core/testing';

import { ApiTicketService } from './api-ticket.service';

describe('ApiTicketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiTicketService]
    });
  });

  it('should be created', inject([ApiTicketService], (service: ApiTicketService) => {
    expect(service).toBeTruthy();
  }));
});
