import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ITicket } from '../../../interfaces/i-ticket';
import { GetBaseUrl } from '../helper/getBaseUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public get(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]);
  }

  public getFromId(id: number): Observable<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map((data) => data as ITicket);
  }

  public getFromCategory(id: number): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket?id_category=' + id).map((data) => data as ITicket[]);
  }

  public getWithCriterias(criteria: TicketFilterCriteria): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket', {
      params: criteria as any
    }).map((data) => data as ITicket[]);
  }

  public update(ticket: ITicket, force: boolean): Observable<ITicket> {
    return this.http.put(`${this.baseUrl}/ticket/${ticket.id}?force=${force}`, ticket).map((data) => data as ITicket);
  }

  public getNewedCount(): Observable<number> {
    return this.http.get<number>(this.baseUrl + '/ticket/newedcount/').map(data => data || 0);
  }
}

export interface TicketFilterCriteria {
  mapped?: string;
  id_status?: string;
  id_user?: string;
  phone?: string;
  id_service?: string;
}
