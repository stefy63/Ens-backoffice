import { Component, Inject, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IChangePassword } from '../../../interfaces/i-change-password';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidator } from '../../services/MaterialValidator/PasswordValidator';
import { EmptyInputValidator } from '../../services/MaterialValidator/EmptyInputValidator';
import { ApiUserService } from '../../services/api/api-user.service';
import { NotificationsService } from 'angular2-notifications';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['./dialog-change-password.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogChangePassword implements OnInit {

  public modalData: IChangePassword;
  public formGroup: FormGroup;
  public oldPasswordView: boolean = true;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogChangePassword>,
    private apiUserService: ApiUserService,
    private toast: NotificationsService,
    private storage: LocalStorageService
  ) {
    this.modalData = {
      user_id: <number>this.data.modalData,
      old_password: '',
      new_password: '',
      confirm_password: ''
    };
  }

  ngOnInit(): void {

    if (this.modalData.user_id !== this.storage.getItem('user').id) {
      this.oldPasswordView = false;
      this.formGroup = new FormGroup({
        'new_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
        'confirm_password': new FormControl('', [Validators.required, PasswordValidator.match])
      });
    } else {
      this.formGroup = new FormGroup({
        'old_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
        'new_password': new FormControl('', [Validators.required, EmptyInputValidator.whiteSpace]),
        'confirm_password': new FormControl('', [Validators.required, PasswordValidator.match])
      });
    }
  }

  onYesClick() {
    this.apiUserService.apiChangePassword(this.modalData)
    .subscribe(() => {
        this.toast.success('Cambio Password', 'Password modificata con successo');
        this.dialogRef.close();
      },
    (err) => {
        if (err.status === 501) {
          delete this.modalData.old_password;
          this.toast.error('Cambio Password', 'Vecchia password Errata!');
        } else {
          this.toast.error('Cambio Password', 'Modifica password fallita!');
        }
      }
    );
  }
}
