import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { IUser } from '../../../interfaces/i-user';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { IGetUserListRequest } from '../../../interfaces/i-get-user-request';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiUserService {

  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

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
}
