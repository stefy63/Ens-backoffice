import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { IUserDataResponse } from '../../../../../interfaces/i-userdata.request';
import { ApiSmsService } from '../../../../services/api/api-sms.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';
import { SearchUserDialogComponent } from '../search-user-dialog/search-user-dialog.component';

@Component({
  selector: 'fuse-sending-sms-form',
  templateUrl: './sending-sms-form.component.html',
  styleUrls: ['./sending-sms-form.component.scss']
})
export class SendingSmsFormComponent implements OnInit {
  public formGroup: FormGroup;
  public idOperator: string;

  constructor(
    public dialog: MatDialog,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private apiSmsService: ApiSmsService,
  ) {
    this.idOperator = this.storage.getItem('user').id;
  }

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
        if (data) {
          this.formGroup.controls.phone.setValue(data.phone);
        }
      });
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      return;
    }

    this.apiSmsService.reverseCreate({
      phone: this.formGroup.controls.phone.value,
      message: this.formGroup.controls.message.value
    }).subscribe((ticket) => {
      this.toast.success('Nuova Richiesta', 'Richiesta creata con successo');
    }, (error) => {
      let errorMessage = 'Errore generico nella creazione della richiesta';
      if (error.error.message === 'ONLINE_TICKET_WITH_SAME_PHONE') {
        errorMessage = 'Esiste già una richiesta in corso con questo numero telefonico';
      }
      this.toast.error('Errore', errorMessage);
    });
  }
}
