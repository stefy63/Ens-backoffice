import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { IToken } from '../interfaces/i-token';

@Injectable()
export class AuthService {

  constructor() { }

  public getToken(): IToken {
    const token = JSON.parse(localStorage.getItem('user'));
    return (token) ? token.token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: IToken = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired
    return (token !== undefined && moment().isSameOrBefore(token.token_expire_date));
  }
}
