import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { IRoles } from '../../../interfaces/i-roles';
import { GetBaseUrl } from '../helper/getBaseUrl';

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
    return this.http.get(this.baseUrl + '/roles').map((data) => (data as IRoles[]).filter((role) => role.portal !== 'frontoffice'));
  }


}

