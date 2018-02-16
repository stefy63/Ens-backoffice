import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ITicket } from '../interfaces/i-ticket';

@Injectable()
export class ApiTicketService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;

  constructor(
    private http: HttpClient,
  ) { }

  public get() {
    return this.http.get<ITicket[]>(this.baseUrl + '/ticket');
  }


}
