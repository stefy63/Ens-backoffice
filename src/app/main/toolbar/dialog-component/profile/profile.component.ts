import { Component, OnInit, Inject } from '@angular/core';
import { ToastOptions } from '../../../../type/toast-options';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { IUser } from '../../../../interfaces/i-user';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { ApiItalyGeoService } from '../../../services/api/api-italy-geo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DateValidator } from '../../../services/MaterialValidator/DateValidator';


export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'fuse-dialog-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DialogProfileComponent implements OnInit {

  public options = ToastOptions;
  public modalData: IUser;
  public formGroup: FormGroup;
  public provinces: any[];
  public gender = [
    { id: 'male', name: 'Maschio'},
    { id: 'female', name: 'Femmina'}
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogProfileComponent>,
    private httpItalyGeo: ApiItalyGeoService
    ) {
      this.httpItalyGeo.apiGetAllProvince()
        .subscribe(provinces => {
          this.provinces = provinces;
        });
  }

  ngOnInit() {
    console.log(this.data.modalData);
    this.modalData = this.data.modalData;
    this.modalData.userdata.privacyaccept = this.modalData.userdata.privacyaccept || true;
    this.formGroup = new FormGroup({
      'name': new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')
      ]),
      'surname': new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')
      ]),
      'born_date': new FormControl('', Validators.compose([
        Validators.required,
        DateValidator.date
      ])),
      'born_city': new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')
      ]),
      'born_province': new FormControl('', [Validators.required]),
      'email': new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]),
      'gender': new FormControl('', [Validators.required]),
      'city': new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')
      ]),
      'address': new FormControl('', [Validators.required]),
      'province': new FormControl('', [Validators.required]),
      'phone': new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])[0-9]+$')
      ]),
      'card_number': new FormControl('', []),
      'fiscalcode': new FormControl('', [
        Validators.required,
        Validators.minLength(16),
        Validators.maxLength(16)
      ]),
      'privacyaccept': new FormControl(),
      'newsletteraccept': new FormControl(),
      'becontacted': new FormControl(),
    });
  }

  onYesClick() {
    this.dialogRef.close(this.modalData);
  }

}
