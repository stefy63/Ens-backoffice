import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicket } from '../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ApiTicketService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;
  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json');


  constructor(
    private http: HttpClient,
  ) {  }

  public get(): Observable<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]);
  }

  public getFromId(id: number): Observable<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map((data) => data as ITicket);
  }
  public getFromCategory(id: number): Observable<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket?id_category=' + id).map((data) => data as ITicket);
  }

  public update(ticket: ITicket): Observable<ITicket> {
    const headers = this.headers;

    const params = this.HttpParamsHelper(ticket);

    const options = {
      headers,
      params
    };
    
    return this.http.put(this.baseUrl + '/ticket/' + ticket.id, null, options).map((data) => data as ITicket);
  }

  
  private HttpParamsHelper(obj: object) {
    let params = new HttpParams();
    for (const property in obj) {
      if (obj.hasOwnProperty(property)) {
        params = params.append(property, obj[property]);
      }
    }
    return params;
  }

}
