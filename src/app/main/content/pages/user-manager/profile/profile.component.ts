import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSlideToggleChange } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { map, assign, assignIn } from 'lodash';
import { AlertToasterOptions } from '../../../../../class/alert-toaster-options';
import { IUserData } from '../../../../../interfaces/i-userdata';
import { AlphabeticOnlyValidator } from '../../../../services/MaterialValidator/AlphabeticOnlyValidator';
import { EmailCustomValidator } from '../../../../services/MaterialValidator/EmailCustomValidator';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';
import { IUser } from '../../../../../interfaces/i-user';
import { AuthService } from '../../../../services/auth/auth.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ITicketOffice } from '../../../../../interfaces/i-ticket-office';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';
import { ApiRolesService } from '../../../../services/api/api-roles.service';
import { IRoles } from '../../../../../interfaces/i-roles';
import { RoleType } from '../../../../../type/user-roles';


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

  public options = AlertToasterOptions;
  public modalData: IUserData;
  public modalUser: IUser;
  public formGroup: FormGroup;
  public provinces: any[];
  public ticketService: ITicketService[];
  public offices: ITicketOffice[];
  public roles: IRoles[];
  public hasOperatorPermission: boolean;
  public onlyOperator: FormControl;
  public gender = [
    { id: 'male', name: 'Maschio'},
    { id: 'female', name: 'Femmina'}
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogProfileComponent>,
    private authService: AuthService,
    private localStorage: LocalStorageService,
    private apiRoles: ApiRolesService
    ) {
      this.hasOperatorPermission = this.authService.hasPermission(['operator.get.all']);

      if (this.hasOperatorPermission) {
        this.ticketService = this.localStorage.getItem('services');
        this.offices = this.localStorage.getItem('offices');
        this.apiRoles.apiGetAllRoles()
          .subscribe(roles => {
            this.roles = roles;
          });
      }
    }

  ngOnInit() {
    this.modalData = this.data.modalData.userdata as IUserData;
    this.modalUser = this.data.modalData as IUser;
    this.modalData.privacyaccept = this.modalData.privacyaccept || true;
    this.formGroup = new FormGroup({
      'username': new FormControl(this.modalUser.username, [
        Validators.required,
        Validators.pattern(/^\S*$/)
      ]),
      'name': new FormControl(this.modalData.name, [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'surname': new FormControl(this.modalData.surname, [
        Validators.required,
        AlphabeticOnlyValidator.alphabeticOnly
      ]),
      'email': new FormControl(this.modalData.email, [
        Validators.required, EmailCustomValidator.email_custom
      ]),
      'gender': new FormControl(this.modalData.gender, [Validators.required]),
      'phone': new FormControl(this.modalData.phone, [
        Validators.required, NumericOnlyValidator.numericOnly
      ]),
      'isOperator': new FormControl(this.modalUser.isOperator),
      'privacyaccept': new FormControl({value: this.modalData.privacyaccept, disabled: true}),
      'newsletteraccept': new FormControl(this.modalData.newsletteraccept),
      'becontacted': new FormControl(this.modalData.becontacted),

    });
    if (this.modalUser.isOperator) {
      this.formGroup.addControl('services', new FormControl(this.modalUser.services, [Validators.required]));
      this.formGroup.addControl('office', new FormControl(this.modalUser.office, [Validators.required]));
      this.formGroup.addControl('role', new FormControl(this.modalUser.role, [Validators.required]));
    }

  }

  compareObjects(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }

  isOperatorChange(ev: MatSlideToggleChange) {
    this.modalUser.isOperator = ev.checked;
    if (ev.checked) {
      this.formGroup.addControl('services', new FormControl(this.modalUser.services, [Validators.required]));
      this.formGroup.addControl('office', new FormControl(this.modalUser.office, [Validators.required]));
      this.formGroup.addControl('role', new FormControl(this.modalUser.role, [Validators.required]));
    } else {
      this.formGroup.removeControl('services');
      this.formGroup.removeControl('office');
      this.formGroup.removeControl('role');
      this.modalUser.id_role = RoleType.USER;
      this.modalUser.services = undefined;
    }
  }


  onYesClick(): void {

    const updatedModalUser = assign(this.modalUser, {
      username: this.formGroup.controls.username.value,
      isOperator: this.formGroup.controls.isOperator.value,
      services: (this.modalUser.isOperator) ? this.formGroup.controls.services.value : this.modalUser.services,
      id_office: (this.modalUser.isOperator) ? this.formGroup.controls.office.value.id : this.modalUser.id_office,
      office: (this.modalUser.isOperator) ? this.formGroup.controls.office.value : this.modalUser.office,
      id_role: (this.modalUser.isOperator) ? this.formGroup.controls.role.value.id : this.modalUser.id_role,
      role: (this.modalUser.isOperator) ? this.formGroup.controls.role.value : this.modalUser.role,
      userdata: {
          name: this.formGroup.controls.name.value,
          surname: this.formGroup.controls.surname.value,
          email: this.formGroup.controls.email.value,
          gender: this.formGroup.controls.gender.value,
          phone: this.formGroup.controls.phone.value,
          privacyaccept: !!this.formGroup.controls.privacyaccept.value,
          newsletteraccept: !!this.formGroup.controls.newsletteraccept.value,
          becontacted: !!this.formGroup.controls.becontacted.value
      },
    });
    this.dialogRef.close(updatedModalUser);
  }

}
