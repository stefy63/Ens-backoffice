import {AbstractControl} from '@angular/forms';

export class AlphabeticOnlyValidator {
  static alphabeticOnly(AC: AbstractControl) {
    if (AC && AC.value && !/^(?=.*[a-zA-Z])[a-zA-Z]+$/.test(AC.value )) {
        return {alphabeticOnly: true};
    }
    return null;
  }
}
