import { Component, Inject } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { ApiUserService } from '../../services/api/api-user.service';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { PasswordValidator } from '../../services/MaterialValidator/CustomPasswordValidator.service';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['./dialog-change-password.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword {

  public modalData: IChangePassword;
  public formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogChangePassword>,
    private apiUserService: ApiUserService
  ) {
    this.modalData = {
        user_id: <number>this.data.modalData,
        old_password: '',
        new_password: '',
        confirm_password: ''
      };
      this.formGroup = new FormGroup({
        'old_password': new FormControl('', Validators.required),
        'new_password': new FormControl('', [Validators.required, Validators.minLength(5)
        /*, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')*/]),
        'confirm_password': new FormControl('', [Validators.required])
      }, { validators: this.MatchPasswordValidator() }
      );
  }

  onYesClick() {

    if (this.modalData.old_password && this.modalData.new_password) {
      console.log(this.modalData);
      delete this.modalData.confirm_password;
      this.apiUserService.apiChangePassword(this.modalData)
        .subscribe(() => {
          this.dialogRef.close('true');
        });
    }

  }

  getErrorMessage() {
    // return this.formGroup.controls[key].hasError('areEqual');
    return this.formGroup.errors;
  }

  public MatchPasswordValidator(): ValidatorFn  {

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
