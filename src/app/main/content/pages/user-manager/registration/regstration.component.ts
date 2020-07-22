import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NotificationsService } from 'angular2-notifications';
import { assign, get } from 'lodash';
import { AlertToasterOptions } from '../../../../../class/alert-toaster-options';
import { IRoles } from '../../../../../interfaces/i-roles';
import { ITicketOffice } from '../../../../../interfaces/i-ticket-office';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';
import { IUser } from '../../../../../interfaces/i-user';
import { ApiItalyGeoService } from '../../../../services/api/api-italy-geo.service';
import { ApiRolesService } from '../../../../services/api/api-roles.service';
import { ApiUserService } from '../../../../services/api/api-user.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { ErrorMessageTranslatorService } from '../../../../services/error-message-translator.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { AlphabeticOnlyValidator } from '../../../../services/MaterialValidator/AlphabeticOnlyValidator';
import { EmailCustomValidator } from '../../../../services/MaterialValidator/EmailCustomValidator';
import { EmptyInputValidator } from '../../../../services/MaterialValidator/EmptyInputValidator';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';
import { PasswordValidator } from '../../../../services/MaterialValidator/PasswordValidator';


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
  selector: 'fuse-dialog-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class DialogRegistrationComponent implements OnInit {

  public options = AlertToasterOptions;
  public user: IUser;
  public formGroup: FormGroup;
  public provinces: any[];
  public gender = [
    { id: 'male', name: 'Maschio'},
    { id: 'female', name: 'Femmina'}
  ];
  public hasOperatorPermission: boolean;
  public ticketService: ITicketService[];
  public offices: ITicketOffice[];
  public roles: IRoles[];


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogRegistrationComponent>,
    public toast: NotificationsService,
    private authService: AuthService,
    private httpItalyGeo: ApiItalyGeoService,
    private apiUserService: ApiUserService,
    private localStorage: LocalStorageService,
    private apiRoles: ApiRolesService,
    private errorMessageTranslatorService: ErrorMessageTranslatorService,
    ) {
      this.hasOperatorPermission = this.authService.hasPermission(['operator.get.all']);
      this.httpItalyGeo.apiGetAllProvince()
        .subscribe(provinces => {
          this.provinces = provinces;
        });

      if (this.hasOperatorPermission) {
        this.ticketService = this.localStorage.getItem('services');
        this.offices = this.localStorage.getItem('offices');
        this.apiRoles.apiGetAllRoles()
          .subscribe(roles => {
            this.roles = roles;
          });
      }
  }

  ngOnInit(): void {

    this.formGroup = new FormGroup({
        'userdata': new FormGroup({
          'name': new FormControl('', [
              Validators.required,
              AlphabeticOnlyValidator.alphabeticOnly
          ]),
          'surname': new FormControl('', [
              Validators.required,
              AlphabeticOnlyValidator.alphabeticOnly
          ]),
          'email': new FormControl('', [
              Validators.required,
              EmailCustomValidator.email_custom
          ]),
          'gender': new FormControl('', [
              Validators.required
              ]),
          'phone': new FormControl('', [
              Validators.required,
              NumericOnlyValidator.numericOnly
          ]),
          // 'card_number': new FormControl('', []),
          'privacyaccept': new FormControl(''),
          'newsletteraccept': new FormControl(''),
          'becontacted': new FormControl(''),
        }),
        'username': new FormControl(''),
        'password': new FormControl('', [
            Validators.required,
            EmptyInputValidator.whiteSpace,
            PasswordValidator.match
        ]),
        'confirm_password':  new FormControl('', [
            Validators.required,
            PasswordValidator.match
        ]),
    });
    if (this.data.onlyOperator) {
      this.formGroup.addControl('services', new FormControl('', [Validators.required]));
      this.formGroup.addControl('office', new FormControl('', [Validators.required]));
      this.formGroup.addControl('role', new FormControl('', [Validators.required]));
    }
  }

  onYesClick(): void {
    const modalDataChanged: IUser = assign({}, this.formGroup.value, {noSendMail: true});

    if (this.data.onlyOperator) {
      modalDataChanged.isOperator = true;
      modalDataChanged.id_office =  this.formGroup.controls.office.value.id;
      modalDataChanged.id_role =  this.formGroup.controls.role.value.id;
      modalDataChanged.services = this.formGroup.controls.services.value;
    } else {
      modalDataChanged.isOperator = false;
    }

    this.apiUserService.apiCreateUser(modalDataChanged)
        .subscribe(data => {
                this.toast.success('Nuovo Utente creato con successo!');
                this.dialogRef.close();
            }, (err) => {
                const errorMessageTranslated = this.errorMessageTranslatorService.translate(get(err, 'error.message', ''));
                this.toast.error(errorMessageTranslated);
            });

    }


}
