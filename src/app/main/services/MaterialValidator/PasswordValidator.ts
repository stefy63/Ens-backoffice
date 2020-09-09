import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static match(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = control.value;
    const newPassword = (control.parent) ? control.parent.get('password').value : '';

    if (newPassword && confirmPassword && newPassword !== confirmPassword){
      control.markAsTouched();
      return { passwordMatch: true };
    }
    return null;
  }
}

