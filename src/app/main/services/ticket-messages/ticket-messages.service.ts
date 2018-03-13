import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiTicketHistoryService } from '../api/api-ticket-history.service';
import { ITicketHistory } from '../../../interfaces/i-ticket-history';

@Injectable()
export class ChatService {

  constructor(private apiTicket: ApiTicketHistoryService)
  {
  }

  public sendMessage(message: ITicketHistory): Observable<ITicketHistory> {
    return this.apiTicket.create(message);
  }

  public markMessagesReaded(idTicket: number): Observable<boolean>  {
    return this.apiTicket.updateReaded(idTicket);
  }
}
