import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ITicketHistory } from '../../../interfaces/i-ticket-history';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketHistoryService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor( private http: HttpClient ) { }

  public create(history: ITicketHistory): Observable<ITicketHistory> {
    history.readed = 0;
    return this.http.post(this.baseUrl + '/tickethistory/', history).map(data => data as ITicketHistory);
  }

  public updateReaded(idTicket: number): Observable<boolean> {
    return this.http.put(this.baseUrl + '/tickethistory/readed/' + idTicket, null).map(data => data as boolean);
  }

  public getUnreadedMessages(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/tickethistory/unreaded/').map(data => data || 0);
  }

}
