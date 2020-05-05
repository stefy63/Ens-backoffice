import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { IUser } from '../../../interfaces/i-user';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { IGetUserListRequest } from '../../../interfaces/i-get-user-request';
import { map } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiUserService {

  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }


  public apiCreateUser(user: IUser): Observable<any> {
    return this.http.post(this.baseUrl + '/user', user);
  }

  public apiChangePassword(user: IChangePassword): Observable<any> {
    return this.http.put(this.baseUrl + '/user/password/' + user.user_id, user);
  }

  public apiChangeProfile(user: IUser): Observable<any> {
    return this.http.put(this.baseUrl + '/user', user);
  }

  public apiGetUserList(request: any): Observable<any> {
    return this.http.get(this.baseUrl + '/user', {
      params: request
    }).pipe(map(data => data as IGetUserListRequest));
  }

  public apiGetOperatorFile(): Observable<any> {
    const  headers = new HttpHeaders({ 'Accept':  'text/csv' });

    return this.http.get(this.baseUrl + '/user/operator-export' , {observe: 'response', responseType: 'blob'})
      .map((data) => {
        const blob = {
          file: new Blob([data.body], { type: data.headers.get('Content-Type') }),
          filename: data.headers.get('File-Name')
        };

        return blob ;
      });
  }


  public apiGetUserFile(request: any): Observable<any> {
    const  headers = new HttpHeaders({ 'Accept':  'text/csv' });
    console.log('-------------------->  ',request);
    return this.http.get(this.baseUrl + '/user/user-export' , {
      observe: 'response',
      params: {filter: request},
      responseType: 'blob'
    })
    .map((data) => {
      const blob = {
        file: new Blob([data.body], { type: data.headers.get('Content-Type') }),
        filename: data.headers.get('File-Name')
      };

      return blob ;
    });
  }
}
