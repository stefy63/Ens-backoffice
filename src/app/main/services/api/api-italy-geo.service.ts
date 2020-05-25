import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiItalyGeoService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiGetAllProvince(): Observable<any> {
    return this.http.get(this.baseUrl + '/italyGeo/province').map(data => data || 0);
  }


}

