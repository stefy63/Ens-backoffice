import {AbstractControl} from '@angular/forms';

export class FiscalCodeValidator {
  static fiscalCode(AC: AbstractControl) {
    if (AC && AC.value && !/^[A-Z]{6}[0-9]{2}[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{3}[A-Z]{1}$/.test(AC.value )) {
        return {fiscalCode: true};
    }
    return null;
  }
}
