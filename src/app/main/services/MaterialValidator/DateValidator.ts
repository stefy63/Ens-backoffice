import {AbstractControl} from '@angular/forms';
import {isObject} from 'lodash';
import * as moment from 'moment';

export class DateValidator {
  static date(AC: AbstractControl) {
    if (AC.value && AC.value._i) {
      let testInput = (!!AC.value._i) ? AC.value._i : '00/00/0000';
      if (isObject(testInput)){
        testInput = moment(testInput).format('DD/MM/YYYY');
      }
      const testRegx = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(testInput);
      if (!testRegx) {
        return {'date': true};
      }
    }
    return null;
  }
}
