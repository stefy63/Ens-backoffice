import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ITicket } from '../interfaces/i-ticket';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiTicketService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;

  constructor(
    private http: HttpClient,
  ) {  }

  public get(): Promise<ITicket[]> {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket').map(data => data as ITicket[]).toPromise();
  }

  public getFromId(id: number): Promise<ITicket> {
    return this.http.get<ITicket>(this.baseUrl + '/ticket/' + id).map((data) => data as ITicket).toPromise();
  }

}
