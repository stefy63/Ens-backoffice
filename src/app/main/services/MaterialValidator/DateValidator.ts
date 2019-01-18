import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  static date(AC: AbstractControl) {
    if (AC && AC.value && (!moment(AC.value).isValid || moment(AC.value).isBefore('01/01/1900') || moment(AC.value).isAfter())) {
      const testValid = moment(AC.value).isValid;
      const testBetween = moment(AC.value).isBetween('01/01/1900', moment());
      const testRegx = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(moment(AC.value).format('DD/MM/YYYY'));
      if (!testValid || !testBetween || !testRegx) {
        return {'date': true};
      }
        
    }
    return null;
  }
}
