import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IChangePassword } from '../../../interfaces/i-change-password';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiUserService {

  private  apiPort = (environment.api_port) ?  ':' + environment.api_port : '';
  private baseUrl: string = environment.api_url + this.apiPort + environment.api_suffix;

  constructor(
    private http: HttpClient,
  ) { }

  public apiChangePassword(user: IChangePassword): Observable<any> {
    return this.http.put(this.baseUrl + '/password/' + user.user_id, user);
  }




  // public apiLogin(dataLogin: IDataLogin): Observable<any> {
  //   // const isOperator = dataLogin.operator;
  //   delete dataLogin.operator;

  //   return this.http.post(this.baseUrl + '/login', dataLogin);
  // }

  // public apiLogout(): Observable<any> {
  //   return this.http.post(this.baseUrl + '/logout', null);
  // }
}
