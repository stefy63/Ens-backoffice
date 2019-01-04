import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';

export class PasswordValidator {

    static areEqual(formGroup: FormGroup, newKey: string, confirmKey: string) {
        const value = formGroup.get(newKey).value;
        let valid = true;
        if (!!formGroup.get(confirmKey).value && formGroup.get(confirmKey).value !== value) {
            valid = false;
        }

        return (valid) ? null : { areEqual: true };
    }

}

export class ConfirmValidParentMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return control.parent.invalid && control.touched;
    }
}
    
