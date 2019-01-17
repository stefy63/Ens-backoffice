import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  static date(AC: AbstractControl) {
    const actualDate = moment(AC.value, 'DD/MM/YYYY');
    console.log(actualDate);
    if (AC && AC.value && !actualDate.isValid()) {
      return {'date': true};
    }
    return null;
  }
}
