import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../interfaces/i-data-login';

@Injectable()
export class ApiService {

  private baseUrl: string = environment.api_url + ':' + environment.api_port + environment.api_suffix;



  constructor(private http: HttpClient) { }

  public apiLogin(dataLogin: IDataLogin, isOperator: boolean) {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const params = new HttpParams()
      .set('username', dataLogin.username)
      .set('password', dataLogin.password);
    const options = {
      headers,
      params
    };

    this.http.post(this.baseUrl + '/login/' + isOperator, null, options)
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );
  }

}
