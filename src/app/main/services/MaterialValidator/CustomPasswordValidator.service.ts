import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {

    public static areEqualValidator(): ValidatorFn {

        return (control: AbstractControl): ValidationErrors | null => {
          // if ( !!control ) {
            const value = control.get('new_password').value;
            const confirm = control.get('confirm_password').value;
            const valid = (!!value && !!confirm && confirm === value);
            console.log(value, confirm, valid);
            return (valid) ? null : { areEqual: true };
          // }
        };
    }

}

