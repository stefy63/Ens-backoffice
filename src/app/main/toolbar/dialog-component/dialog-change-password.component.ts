import { Component, Inject } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { ApiUserService } from '../../services/api/api-user.service';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['../toolbar.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword {
  
  public modalData: IChangePassword;


  constructor(
    @Inject(MAT_DIALOG_DATA) public user_id: number;
    public dialogRef: MatDialogRef<DialogChangePassword>,
    private apiUserService: ApiUserService
  ) {
    this.modalData = {
    user_id: this.user_id,
    old_password: '',
    new_password: '',
    confirm_password: ''
  };
  }

  async onYesClick() {

    if(!!this.modalData && this.modalData.new_password && this.modalData.confirm_password) {
      delete this.modalData.confirm_password;
      this.apiUserService.apiChangePassword(this.modalData)
        .subscribe(() => {
          this.dialogRef.close('true');
        });
    }
    }
      
  }

}
