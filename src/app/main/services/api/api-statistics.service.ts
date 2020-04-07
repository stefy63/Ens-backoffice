import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { Observable } from 'rxjs/Observable';
import { ICallStatistics } from '../../../interfaces/i-call-statistics';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiStatisticsService {

  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public get(range: ICallStatistics): Observable<any> {
    return this.http.get(this.baseUrl + '/statistics', {params: range as any}).map((data) => data as any[]);
  }

}
