import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ITokenSession } from '../interfaces/i-token-session';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {

  constructor(private storage: LocalStorageService) { }

  public getToken(): ITokenSession {
    const token =  this.storage.getItem('token');
    return (token) ? token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: ITokenSession = this.getToken();
    return (token !== undefined && moment().isSameOrBefore(token.token_expire_date));
  }
}
