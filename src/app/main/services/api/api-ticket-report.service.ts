import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ITicketReport } from '../../../interfaces/i-ticket-report';
import { Observable } from 'rxjs/Observable';
import { ITicketExportRequest } from '../../../interfaces/i-ticket-export-request';


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

  public get(request: ITicketExportRequest): Observable<any> {
    const  headers = new HttpHeaders({ 'Accept':  'text/csv' });


    let params = new HttpParams();
    Object.keys(request).forEach((key) => {
      params = params.append(key, request[key]);
    });

    return this.http.get(this.baseUrl + '/ticketreport' , {observe: 'response', responseType: 'blob', params: params})
              .map((data) => {
                const blob = {
                  file: new Blob([data.body], { type: data.headers.get('Content-Type') }),
                  filename: 'reports.csv'
                };

                return blob ;
              });
  }
}
