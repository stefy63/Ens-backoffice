import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { IGetUserListRequest } from '../../../interfaces/i-get-user-request';
import { IUser } from '../../../interfaces/i-user';
import { GetBaseUrl } from '../helper/getBaseUrl';


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
    }).pipe(map((data: any) => {
      data.page.onlyOperator = data.page.onlyOperator === 'true';
      return data as IGetUserListRequest;
    }));
  }

  public exportUserDetails(filter: any, operator: boolean){
    const exportRelativePath = (operator) ? '/user/operator-export' : '/user/user-export';
    return this.http.get(this.baseUrl + exportRelativePath , {
      observe: 'response',
      params: {filter: filter},
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
  
  public apiGetUserById(id: number): Observable<any> {
    return this.http.get(this.baseUrl + '/user/' + id)
      .map((data) => {
        return data as IUser;
      });
  }
}
