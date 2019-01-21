import {AbstractControl} from '@angular/forms';

export class AlphabeticOnlyValidator {
  static alphabeticOnly(AC: AbstractControl) {
    if (AC && AC.value && !/^(?=.*[A-zÀ-ú])[A-zÀ-ú]+$/.test(AC.value )) {
        return {alphabeticOnly: true};
    }
    return null;
  }
}
