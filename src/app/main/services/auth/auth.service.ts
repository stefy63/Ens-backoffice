import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { ITokenSession } from '../../../interfaces/i-token-session';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { IUser } from '../../../interfaces/i-user';
import { find, forEach } from 'lodash';

@Injectable()
export class AuthService {

  constructor(private storage: LocalStorageService) { }

  public getToken(): ITokenSession {
    const token =  this.storage.getItem('token');
    return (token) ? token : undefined;
  }

  public isAuthenticated(): boolean {
    const token: ITokenSession = this.getToken();
    return (!!token && moment().isSameOrBefore(token.token_expire_date));
  }

  public isOperator(): boolean {
    const user: IUser = this.storage.getItem('user');
    return user.isOperator;

  }

  public hasPermission(permissions: string[]): boolean {
    const user: IUser = this.storage.getItem('user');
    let retValue = false;
    if (!!user) {
      forEach(permissions, (permission) => {
        if(!!find(user.role.permissions, {'action': permission})) {
          retValue = true;
        }
      });
    }
    return retValue;
  }
}
