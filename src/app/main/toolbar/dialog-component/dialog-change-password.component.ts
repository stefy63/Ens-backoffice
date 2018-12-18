import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';

@Component({
  selector: 'fuse-dialog-change-password',
  templateUrl: './dialog-change-password.html',
  styleUrls: ['../toolbar.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogDetail {

  constructor(
    public dialogRef: MatDialogRef<DialogCloseTicket>,
    private storage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.call_type = this.storage.getItem('call_type');
    this.call_result = this.storage.getItem('call_result');
  }
}
