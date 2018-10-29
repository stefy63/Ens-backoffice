import { FormControl } from '@angular/forms';

export class PhoneValidator {
  static validPhone(fc: FormControl){
    if (!!fc.value && isNaN(Number(fc.value))) {
      return { PhoneValidator: true };
    } else {
      return null;
    }
  }
}
