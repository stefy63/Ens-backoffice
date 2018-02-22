import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {FuseUtils} from '../../core/fuseUtils';
import { ApiTicketHistoryService } from '../api/api-ticket-history.service';
import { ITicketHistory } from '../../interfaces/i-ticket-history';

@Injectable()
export class ChatService {

  constructor(private apiTicket: ApiTicketHistoryService)
  {
  }

  public async sendMessage(message: ITicketHistory) {
    return await this.apiTicket.create(message);
  }

  public async markMessagesReaded(idTicket: number) {
    return await this.apiTicket.updateReaded(idTicket);
  }
}
