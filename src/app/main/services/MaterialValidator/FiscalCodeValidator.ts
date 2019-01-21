import {AbstractControl} from '@angular/forms';

export class FiscalCodeValidator {
  static fiscalCode(AC: AbstractControl) {
    // tslint:disable-next-line:max-line-length
    if (AC && AC.value && !(/^([A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1})|([0-9]{11})$/.test(AC.value ))) {
        return {fiscalCode: true};
    }
    return null;
  }
}
