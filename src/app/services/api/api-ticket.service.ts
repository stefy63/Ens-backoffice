import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ITicket } from '../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class ApiTicketService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

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

  public normalizeTickets(ticket: ITicket[]): any[]  {

    return _.chain(ticket)
                .map((item) => {
                    const closed_at = (item.status.status === 'CLOSED' || item.status.status === 'REFUSED' ) ? _.chain(item.historys)
                                        .filter(elem => elem.type.type === 'SYSTEM')
                                        .orderBy(['date_time'])
                                        .findLast()
                                        .value() : '';
                    return {
                        id: item.id,
                        service: item.service.service,
                        status: item.status.status,
                        id_operator: item.id_operator,
                        id_user: item.id_user,
                        operator_firstname: (item.operator) ? item.operator.firstname : '',
                        operator_lastname: (item.operator) ? item.operator.lastname : '',
                        user_name: (item.user) ? item.user.name : '',
                        user_surname: (item.user) ? item.user.surname : '',
                        category: (item.category) ? item.category.category : '',
                        phone: item.phone,
                        date_time: moment(item.date_time).format('DD/MM/YYYY HH:mm'),
                        historys: item.historys,
                        closed_at: (closed_at) ? moment(closed_at.date_time).format('DD/MM/YYYY HH:mm') : undefined
                    };
                })
                .value();
    }
}
