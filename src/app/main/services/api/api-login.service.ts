import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../../../interfaces/i-data-login';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { ITokenSession } from '../../../interfaces/i-token-session';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiLoginService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public apiLogin(dataLogin: IDataLogin): Observable<any> {
    const isOperator = dataLogin.operator;
    delete dataLogin.operator;

    return this.http.post(this.baseUrl + '/login/' + isOperator, dataLogin);
  }

  public apiLogout(): Observable<any> {
    return this.http.post(this.baseUrl + '/logout', null);
  }
}
