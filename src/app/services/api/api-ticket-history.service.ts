import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicketHistory } from '../../interfaces/i-ticket-history';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiTicketHistoryService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
  ) {  }

  public create(history: ITicketHistory): Observable<ITicketHistory> {
    const headers = this.headers;
    const params = new HttpParams()
      .set('id_ticket', history.id_ticket.toString())
      .set('id_type', history.id_type.toString())
      .set('action', history.action)
      .set('readed', '0')
      .set('date_time', moment().toISOString());

    const options = {
      headers,
      params
    };

    return this.http.post(this.baseUrl + '/tickethistory/' + history.id_ticket, null, options).map(data => data as ITicketHistory);
  }

  public updateReaded(idTicket: number): Observable<boolean> {
    const headers = this.headers;

    const options = {
      headers
    };
    return this.http.put(this.baseUrl + '/tickethistory/' + idTicket, null, options).map(data => data as boolean);
  }


}
