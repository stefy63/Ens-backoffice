import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';

@Component({
  selector: 'fuse-sending-sms-form',
  templateUrl: './sending-sms-form.component.html',
  styleUrls: ['./sending-sms-form.component.scss']
})
export class SendingSmsFormComponent implements OnInit {
  public formGroup: FormGroup;

  constructor() { }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'phone': new FormControl('', [Validators.required, NumericOnlyValidator.numericOnly]),
      'message': new FormControl('', [Validators.required]),
    });
  }

  searchUser() {
    console.log('SEARCHING USER');
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    console.log('SENDING');
  }
}
