import { Component, OnInit, Inject } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'fuse-dialog-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class DialogProfileComponent implements OnInit {

  public options = ToastOptions;
  public modalData: any;
  public formGroup: FormGroup;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogProfileComponent>
    ) {
  }

  ngOnInit() {
    console.log(this.data);
    this.formGroup = new FormGroup({
      'old_password': new FormControl('', Validators.required),
      'new_password': new FormControl('', [Validators.required]),
      'confirm_password': new FormControl('', [Validators.required])
    });
  }

  onYesClick() {
    this.dialogRef.close(this.modalData);
  }

}
