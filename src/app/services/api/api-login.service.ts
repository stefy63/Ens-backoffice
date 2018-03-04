import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../../interfaces/i-data-login';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { IOperator } from '../../interfaces/i-operator';
import { forEach } from 'lodash';
import { ITokenSession } from '../../interfaces/i-token-session';

@Injectable()
export class ApiLoginService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;

    private headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public apiLogin(dataLogin: IDataLogin): Observable<any> {
    const headers = this.headers;
    const params = new HttpParams()
      .set('username', dataLogin.username)
      .set('password', dataLogin.password);

    const options = {
      headers,
      params
    };

    return this.http.post(this.baseUrl + '/login/' + dataLogin.operator, null, options);
  }

  public apiLogout(): Observable<any> {
    const dataLogout: ITokenSession = this.storage.getItem('token');
    const headers = this.headers;
    const params = new HttpParams()
    .set('idtokensession', dataLogout.id.toString());

    const options = {
      headers,
      params
    };

    return this.http.post(this.baseUrl + '/logout', null, options);
  }
}
