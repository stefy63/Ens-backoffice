import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmptyInputValidator {
  static whiteSpace(control: AbstractControl): ValidationErrors | null {
    const input = control.value;
    if (/\s/.test(input)){
      return { whiteSpace: true };
    }
    return null;
  }
}
