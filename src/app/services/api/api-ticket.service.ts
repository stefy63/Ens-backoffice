import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicket } from '../../interfaces/i-ticket';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiTicketService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;
  private headers = new HttpHeaders()
  .set('Content-Type', 'application/json');


  constructor(
    private http: HttpClient,
  ) {  }

  public get(): Promise<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]).toPromise();
  }

  public getFromId(id: number): Promise<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map((data) => data as ITicket).toPromise();
  }

  public update(ticket: ITicket): Promise<ITicket> {
    const headers = this.headers;

    const params = this.HttpParamsHelper(ticket);

    const options = {
      headers,
      params
    };
    
    return this.http.put(this.baseUrl + '/ticket/' + ticket.id, null, options).map((data) => data as ITicket).toPromise();
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
