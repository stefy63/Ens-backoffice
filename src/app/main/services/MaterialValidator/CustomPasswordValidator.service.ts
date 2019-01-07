import { FormGroup, FormControl, FormGroupDirective, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class PasswordValidator {

    static areEqualValidator(formGroup: FormGroup, newKey: string, confirmKey: string): ValidatorFn {
        const value = formGroup.get(newKey).value;
        let valid = true;
        if (!!value && !!formGroup.get(confirmKey).value && formGroup.get(confirmKey).value !== value) {
          console.log(value, formGroup.get(confirmKey).value);
          valid = false;
        }

        return (control: AbstractControl): { [key: string]: boolean } | null => {
            return (valid) ? null : { 'areEqual': true };
        };
    }

}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
      console.log('EEEEEEEEE   -<  ', control);
      return control.parent.invalid && control.touched;
    }
}

