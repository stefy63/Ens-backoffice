import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { ApiUserService } from '../../services/api/api-user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../../services/MaterialValidator/PasswordValidator';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['./dialog-change-password.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword implements OnInit {

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
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'old_password': new FormControl('', Validators.required),
      'new_password': new FormControl('', [Validators.required]),
      'confirm_password': new FormControl('', [Validators.required, PasswordValidator.match])
    });
  }

  onYesClick() {
    if (this.modalData.old_password && this.modalData.new_password) {
      console.log(this.modalData);
      delete this.modalData.confirm_password;
      this.apiUserService.apiChangePassword(this.modalData)
        .subscribe(() => {
          this.dialogRef.close('true');
        },
        (err) => {
          this.dialogRef.close('false');
        }
        );
    }

  }
}
