import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../../services/MaterialValidator/PasswordValidator';
import { EmptyInputValidator } from '../../services/MaterialValidator/EmptyInputValidator';

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
      'old_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
      'new_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
      'confirm_password': new FormControl('', [Validators.required, PasswordValidator.match])
    });
  }

  onYesClick() {
    delete this.modalData.confirm_password;
    this.dialogRef.close(this.modalData);
  }
}
