import { Component, Inject } from '@angular/core';
import { ICallType } from '../../../../../../interfaces/i-call-type';
import { ICallResult } from '../../../../../../interfaces/i-call-result';
import { ITicketReport } from '../../../../../../interfaces/i-ticket-report';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogCloseTicket } from './dialog-close.component';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { ApiTicketReportService } from '../../../../../services/api/api-ticket-report.service';
import { ToastMessage } from '../../../../../services/toastMessage.service';
import * as _ from 'lodash';



@Component({
  selector: 'fuse-dialog-detail',
  templateUrl: './dialog-detail.html',
  styleUrls: ['../ticket-head.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogDetail {
  public call_type: ICallType[];
  public call_result: ICallResult[];
  public ticket_report: ITicketReport[] = this.data.ticket.reports.length > 0 ? this.data.ticket.reports : [
    {
      id_ticket: this.data.ticket.id,
      number: '',
      id_call_type: 0,
      id_call_result: 0
    }
  ];

  private user;

  constructor(
    public dialogRef: MatDialogRef<DialogCloseTicket>,
    private storage: LocalStorageService,
    private apiTicketReportService: ApiTicketReportService,
    private toastMessage: ToastMessage,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.call_type = this.storage.getItem('call_type');
    this.call_result = this.storage.getItem('call_result');
    this.user = this.storage.getItem('user');
  }

  async onYesClick() {
    const confirm = await this.toastMessage.warning('Conferma chiusura Ticket?', 'Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    if (confirm.value) {
      if (this.ticket_report[0].id_call_result !== 0 && this.ticket_report[0].id_call_type !== 0 && this.ticket_report[0].number !== '') {
        const reports = _.filter(this.ticket_report, (item: ITicketReport) => {
          return (!!item.id_call_result && !!item.id_call_type && !!item.number);
        });
        if (reports.length === this.ticket_report.length) {
          this.apiTicketReportService.create(reports)
            .subscribe(() => {
              this.dialogRef.close('true');
            });
        }
      }
    }
  }

  onAddItem() {
    this.ticket_report.push({
      id_ticket: this.data.ticket.id,
      number: '',
      id_call_type: 0,
      id_call_result: 0
    });
  }

  onRemoveItem(index: number) {
    this.ticket_report.splice(index, 1);
  }
}
