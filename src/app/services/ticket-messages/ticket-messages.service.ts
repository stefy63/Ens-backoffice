import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {FuseUtils} from '../../core/fuseUtils';
import { ApiTicketHistoryService } from '../api/api-ticket-history.service';
import { ITicketHistory } from '../../interfaces/i-ticket-history';
import { ITicket } from '../../interfaces/i-ticket';

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
