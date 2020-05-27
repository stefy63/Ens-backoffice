import { Injectable } from '@angular/core';
import {Dictionary} from 'lodash';

@Injectable()
export class ErrorMessageTranslatorService {

  private errorMessages: Dictionary<string> = {
    'EMAIL_ALREDY_EXIST' : 'Email esistente!',
    'USER_ALREDY_EXIST' : 'Username esistente!',
    'GENERIC' : 'Modifica Profilo fallita!',

  };

  constructor() { }

  public Translate(err: string) {
    return this.errorMessages[err] || this.errorMessages['GENERIC'];
  }

}
