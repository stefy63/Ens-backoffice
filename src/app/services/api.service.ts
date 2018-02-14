import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../interfaces/i-data-login';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class ApiService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;



  constructor(private http: HttpClient) { }

  public apiLogin(dataLogin: IDataLogin, isOperator: boolean): Observable<any> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new HttpParams()
      .set('username', dataLogin.username)
      .set('password', dataLogin.password);

    const options = {
      headers,
      params
    };

    return this.http.post(this.baseUrl + '/login/' + isOperator, null, options)
      .do((data) => localStorage.setItem('user', JSON.stringify(data)));
  }

}
