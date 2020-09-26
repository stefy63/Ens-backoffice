import { Injectable } from '@angular/core';
import { Dictionary } from 'lodash';

@Injectable()
export class ErrorMessageTranslatorService {

  private errorMessages: Dictionary<string> = {
    'EMAIL_ALREDY_EXIST' : 'Email già presente in archivio!',
    'USER_ALREDY_EXIST' : 'Username già presente in archivio!',
    'PHONE_ALREDY_EXIST': 'Telefono già presente in archivio!',
    'GENERIC' : 'Modifica fallita!',
  };

  constructor() { }

  public translate(err: string) {
    return this.errorMessages[err] || this.errorMessages['GENERIC'];
  }

}
