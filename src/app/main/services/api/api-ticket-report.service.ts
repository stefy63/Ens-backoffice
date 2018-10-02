import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ITicketReport } from '../../../interfaces/i-ticket-report';
import { Observable } from 'rxjs/Observable';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiTicketReportService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor(private http: HttpClient) { }

  public create(report: ITicketReport[]): Observable<ITicketReport> {

    return this.http.post(this.baseUrl + '/ticketreport/' + report[0].id_ticket, report).map(data => data as ITicketReport);
  }

}
