import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';
import { MatDialog } from '@angular/material';
import { SearchUserDialogComponent } from '../search-user-dialog/search-user-dialog.component';
import { IUserDataRequest, IUserDataResponse } from '../../../../../interfaces/i-userdata.request';

@Component({
  selector: 'fuse-sending-sms-form',
  templateUrl: './sending-sms-form.component.html',
  styleUrls: ['./sending-sms-form.component.scss']
})
export class SendingSmsFormComponent implements OnInit {
  public formGroup: FormGroup;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'phone': new FormControl('', [Validators.required, NumericOnlyValidator.numericOnly]),
      'message': new FormControl('', [Validators.required]),
    });
  }

  searchUser() {
    this.dialog.open(SearchUserDialogComponent, {
      hasBackdrop: true,
      panelClass: 'confirm-panel'
    })
    .afterClosed()
    .subscribe((data: IUserDataResponse) => {
      if (data){
        this.formGroup.controls.phone.setValue(data.phone);
      }
    });
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    console.log('SENDING');
  }
}
