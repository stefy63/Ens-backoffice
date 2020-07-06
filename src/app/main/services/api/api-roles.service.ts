import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { GetBaseUrl } from '../helper/getBaseUrl';
import {IRoles} from '../../../interfaces/i-roles';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ApiRolesService {


  private baseUrl = GetBaseUrl.baseUrl();

  constructor(
    private http: HttpClient,
  ) { }

  public apiGetAllRoles(): Observable<IRoles[]> {
    return this.http.get(this.baseUrl + '/roles').map((data) => data as IRoles[]);
  }


}

