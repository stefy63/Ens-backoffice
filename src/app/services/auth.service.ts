import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { IToken } from '../interfaces/i-token';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {

  constructor(private storage: LocalStorageService) { }

  public getToken(): IToken {
    const token =  JSON.parse(this.storage.getItem('user'));
    return (token) ? token.token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: IToken = this.getToken();
    return (token !== undefined && moment().isSameOrBefore(token.token_expire_date));
  }
}
