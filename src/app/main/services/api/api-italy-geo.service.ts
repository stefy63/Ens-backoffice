import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiItalyGeoService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor(
    private http: HttpClient,
  ) { }

  public apiGetAllProvince(): Observable<any> {
    return this.http.get(this.baseUrl + '/italyGeo/province').map(data => data || 0);
  }


}
