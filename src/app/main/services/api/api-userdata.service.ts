import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';
import { IUserDataResponse, IUserDataRequest } from '../../../interfaces/i-userdata.request';

@Injectable()
export class ApiUserDataService {

  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public find(_params: IUserDataRequest): Observable<IUserDataResponse[]> {
    return this.http.get<IUserDataResponse[]>(this.baseUrl + '/userdata/', {
      params: _params as any
    });
  }
}
