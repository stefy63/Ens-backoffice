import { Component, Inject } from '@angular/core';
import { ICallType } from '../../../../../../interfaces/i-call-type';
import { ICallResult } from '../../../../../../interfaces/i-call-result';
import { ITicketReport } from '../../../../../../interfaces/i-ticket-report';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogCloseTicket } from './dialog-close.component';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
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

  constructor(
    public dialogRef: MatDialogRef<DialogCloseTicket>,
    private storage: LocalStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.call_type = this.storage.getItem('call_type');
    this.call_result = this.storage.getItem('call_result');
  }
}
