import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicket } from '../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor(
    private http: HttpClient,
  ) {  }

  public get(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]);
  }

  public getFromId(id: number): Observable<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map((data) => data as ITicket);
  }

  public getFromCategory(id: number): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket?id_category=' + id).map((data) => data as ITicket[]);
  }

  public getFromDate(limit: number, id_status?: number, id_user?: number): Observable<ITicket[]> {
    let option: string = '?mapped=' + limit;
    if (!!id_status) {option += '&id_status=' + id_status; }
    if (id_user !== undefined) {option += '&id_user=' + id_user; }
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket' + option).map((data) => data as ITicket[]);
  }

  public update(ticket: ITicket): Observable<ITicket> {
    return this.http.put(this.baseUrl + '/ticket/' + ticket.id, ticket).map((data) => data as ITicket);
  }

}
