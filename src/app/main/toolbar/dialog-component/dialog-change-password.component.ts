import { Component, Inject } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { ApiUserService } from '../../services/api/api-user.service';
import { FormGroup, FormControl, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['../toolbar.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword {

  public modalData: IChangePassword;
  public formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public user_id: number,
    public dialogRef: MatDialogRef<DialogChangePassword>,
    private apiUserService: ApiUserService
  ) {
    this.modalData = {
        user_id: this.user_id,
        old_password: '',
        new_password: '',
        confirm_password: ''
      };
      this.formGroup = new FormGroup({
        'old_password': new FormControl('', Validators.required),
        'new_password': new FormControl('', Validators.required),
        'confirm_password': new FormControl('', Validators.required)
      }, { validators: this.formValidator });
  }

  onYesClick() {

    if (this.modalData.old_password && this.modalData.new_password) {
      console.log(this.modalData);
      // delete this.modalData.confirm_password;
      // this.apiUserService.apiChangePassword(this.modalData)
      //   .subscribe(() => {
      //     this.dialogRef.close('true');
      //   });
    }

  }

  formValidator(control: AbstractControl): ValidationErrors {
    const newP = control.get('new_password');
    const confirmP = control.get('confirm_password');
    return (newP === confirmP) ? { 'identityRevealed': true } : null;
  }

}
