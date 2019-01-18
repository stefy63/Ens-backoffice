import {AbstractControl} from '@angular/forms';

export class EmailCustomValidator {
  static email_custom(AC: AbstractControl) {
    if (AC && AC.value && !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/.test(AC.value )) {
        return {email_custom: true};
    }
    return null;
  }
}
