import {AbstractControl} from '@angular/forms';

export class AlphabeticOnlyValidator {
  static alphabeticOnly(AC: AbstractControl) {
    if (AC && AC.value && !/^(?=.*[a-zA-Zàèéìòù])[a-zA-Zàèéìòù]+$/.test(AC.value )) {
        return {alphabeticOnly: true};
    }
    return null;
  }
}
