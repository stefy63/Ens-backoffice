import {AbstractControl} from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {
  static date(AC: AbstractControl) {
    if (AC && AC.value && !moment(AC.value, 'DD/MM/YYYY').isValid()) {
        return {'date': true};
    }
    return null;
  }
}
