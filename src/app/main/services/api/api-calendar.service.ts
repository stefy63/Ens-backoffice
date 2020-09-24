import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { ICalendar } from '../../../interfaces/i-calendar';
import {Services} from '../../../enums/ticket-services.enum';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiCalendarService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor( private http: HttpClient ) { }


  public apiGetCalendarFromService(service: Services): Observable<ICalendar[]> {
    return this.http.get(this.baseUrl + '/calendar/service/' + service)
      .map((data) => (data as ICalendar[]));
  }

  public apiUpdateChannel(timeGroup: ICalendar[]): Observable<boolean> {
    return this.http.put(this.baseUrl + '/calendar/service/' + timeGroup[0].id_service, timeGroup).map(data => data as boolean);
  }

}
