import {AbstractControl} from '@angular/forms';

export class NumericOnlyValidator {
  static numericOnly(AC: AbstractControl) {
    if (AC && AC.value && !/^(?=.*[0-9])[0-9]+$/.test(AC.value )) {
        return {numericOnly: true};
    }
    return null;
  }
}
