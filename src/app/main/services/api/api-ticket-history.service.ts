import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicketHistory } from '../../../interfaces/i-ticket-history';
import * as moment from 'moment';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketHistoryService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor( private http: HttpClient ) { }

  public create(history: ITicketHistory): Observable<ITicketHistory> {

    history.readed = 0;
    history.date_time = moment().toISOString();

    return this.http.post(this.baseUrl + '/tickethistory/' + history.id_ticket, history).map(data => data as ITicketHistory);
  }

  public updateReaded(idTicket: number): Observable<boolean> {
    return this.http.put(this.baseUrl + '/tickethistory/' + idTicket, null).map(data => data as boolean);
  }


}
