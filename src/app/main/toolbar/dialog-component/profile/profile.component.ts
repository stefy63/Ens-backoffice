import { Component, OnInit, Inject } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IUser } from '../../../../interfaces/i-user';

@Component({
  selector: 'fuse-dialog-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class DialogProfileComponent implements OnInit {

  public options = ToastOptions;
  public modalData: IUser;
  public formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogProfileComponent>
    ) {
  }

  ngOnInit() {
    console.log(this.data.modalData);
    this.modalData = this.data.modalData;
    this.formGroup = new FormGroup({
      'name': new FormControl('', Validators.required),
      'surname': new FormControl('', [Validators.required]),
      'born_date': new FormControl('', [Validators.required]),
      'born_city': new FormControl('', [Validators.required]),
      'born_state': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'gender': new FormControl('', [Validators.required]),
      'city': new FormControl('', [Validators.required]),
      'address': new FormControl('', [Validators.required]),
      'state': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [Validators.required]),
      'card_number': new FormControl('', [Validators.required]),
      'vat': new FormControl('', [Validators.required]),
      'privacyaccept': new FormControl(true, [Validators.required]),
      'newsletteraccept': new FormControl('', [Validators.required]),
      'becontacted': new FormControl('', [Validators.required]),
    });
  }

  onYesClick() {
    this.dialogRef.close(this.modalData);
  }

}
