import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { ITicketService } from '../../../interfaces/i-ticket-service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketServiceService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor( private http: HttpClient ) { }


  public apiGetServiceFromId(id: number): Observable<ITicketService> {
    return this.http.get(this.baseUrl + '/ticket-service/' + id)
      .map((data) => (data as ITicketService));
  }


}
