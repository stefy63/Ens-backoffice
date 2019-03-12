import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicket } from '../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { Services } from '../../../enums/ticket-services.enum';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiSmsService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public reverseCreate(reverseSmsRequest: ReverseSmsRequest): Observable<ITicket> {
    return this.http.post<ITicket>(this.baseUrl + '/smsmanager/reverse', reverseSmsRequest);
  }
}

export interface ReverseSmsRequest {
    phone: string;
    message: string;
}
