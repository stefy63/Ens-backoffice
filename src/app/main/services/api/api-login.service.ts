import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { IDataLogin } from '../../../interfaces/i-data-login';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { GetBaseUrl } from '../helper/getBaseUrl';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiLoginService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
    private storage: LocalStorageService
  ) { }

  public apiLogin(dataLogin: IDataLogin): Observable<any> {
    // const isOperator = dataLogin.operator;
    delete dataLogin.operator;

    return this.http.post(this.baseUrl + '/login', dataLogin);
  }

  public apiLogout(): Observable<any> {
    return this.http.post(this.baseUrl + '/logout', null);
  }
}
