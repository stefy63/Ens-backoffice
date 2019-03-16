import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import { IUserDataResponse } from '../../../../../interfaces/i-userdata.request';
import { ApiSmsService } from '../../../../services/api/api-sms.service';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NumericOnlyValidator } from '../../../../services/MaterialValidator/NumericOnlyValidator';
import { SearchUserDialogComponent } from '../search-user-dialog/search-user-dialog.component';
import { ApiTicketHistoryService } from '../../../../services/api/api-ticket-history.service';
import { flatMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';
import { ITicketCategory } from '../../../../../interfaces/i-ticket-category';
import { Router } from '@angular/router';

@Component({
  selector: 'fuse-sending-sms-form',
  templateUrl: './sending-sms-form.component.html',
  styleUrls: ['./sending-sms-form.component.scss']
})
export class SendingSmsFormComponent implements OnInit {
  public formGroup: FormGroup;
  public idOperator: string;
  public categories: ITicketCategory[];

  constructor(
    public dialog: MatDialog,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private apiSmsService: ApiSmsService,
    private ticketHistoryService: ApiTicketHistoryService,
    private router: Router,

  ) {
    this.idOperator = this.storage.getItem('user').id;
    this.categories = this.storage.getItem('ticket_category');
  }

  ngOnInit() {
    this.formGroup = new FormGroup({
      'phone': new FormControl('', [Validators.required, NumericOnlyValidator.numericOnly]),
      'message': new FormControl('', [Validators.required]),
      'id_category': new FormControl('', [Validators.required]),
      'description': new FormControl('', []),
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
      message: this.formGroup.controls.message.value,
      id_category: this.formGroup.controls.id_category.value,
    })
    .pipe((
      flatMap((ticket: ITicket) => {
        const description: string = this.formGroup.controls.description.value;
        return (description) ? 
          this.ticketHistoryService.create({
            id_ticket: ticket.id,
            id_type: HistoryTypes.INITIAL,
            action: description
          }) : of(ticket);
      })
    ))
    .subscribe((ticket) => {
      this.toast.success('Nuova Richiesta', 'Richiesta creata con successo');
      this.router.navigate(['pages/dashboard']);
    }, (error) => {
      let errorMessage = 'Errore generico nella creazione della richiesta';
      if (error.error.message === 'ONLINE_TICKET_WITH_SAME_PHONE') {
        errorMessage = 'Esiste già una richiesta in corso con questo numero telefonico';
      }
      this.toast.error('Errore', errorMessage);
    });
  }
}
