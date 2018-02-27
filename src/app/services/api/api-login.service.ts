import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../../interfaces/i-data-login';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable()
export class ApiLoginService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;

    private headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public apiLogin(dataLogin: IDataLogin, isOperator: boolean): Observable<any> {

    const headers = this.headers;
    const params = new HttpParams()
      .set('username', dataLogin.username)
      .set('password', dataLogin.password);

    const options = {
      headers,
      params
    };

    return this.http.post(this.baseUrl + '/login/' + isOperator, null, options);
  }

}
