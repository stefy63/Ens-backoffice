import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Location } from '@angular/common';
import { find } from 'lodash';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { Status } from '../../../../../enums/ticket-status.enum';
import swal from 'sweetalert2';
import { ApiTicketHistoryService } from '../../../../services/api/api-ticket-history.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { SocketService } from '../../../../services/socket/socket.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { WsEvents } from '../../../../../type/ws-events';
import { Router } from '@angular/router';
import { NormalizeTicket } from '../../../../services/helper/normalize-ticket';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ICallType } from '../../../../../interfaces/i-call-type';
import { ICallResult } from '../../../../../interfaces/i-call-result';
import { ITicketReport } from '../../../../../interfaces/i-ticket-report';
import { ApiTicketReportService } from '../../../../services/api/api-ticket-report.service';
import * as _ from 'lodash';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastMessage } from '../../../../services/toastMessage.service';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit, OnDestroy {
  private interval;

  @Input('ticket') newTicket: Observable<ITicket>;
  @Output('open') open: EventEmitter<boolean> = new EventEmitter();
  public ticket: ITicket;
  public ticketReason: string;
  public user;
  public badge = 0;
  public msgAlert: boolean;
  public isOpen = false;
  public timeout = false;
  public phone: string;


  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService,
    private socketService: SocketService,
    private apiTicketHistoryService: ApiTicketHistoryService,
    private router: Router,
    public dialog: MatDialog,
    private toastMessage: ToastMessage
  ) {
    this.user = this.store.getItem('user');
  }

  ngOnInit() {
    this.newTicket.subscribe(async (data: ITicket) => {
      if (this.ticket && this.ticket.status.status === 'NEW' && data.status.status !== 'NEW' && !this.isOpen) {
        this.toastMessage.error('ATTENZIONE! TICKET GIA ACQUISITO', 'TICKET PRESO IN CARICO DA ALTRO OPERATORE');
        this.location.back();
      }
      this.ticket = NormalizeTicket.normalizeItem([data])[0];
      const initMessage = find(data.historys, item => item.type.type === 'INITIAL');
      this.ticketReason = (initMessage) ? initMessage.action : '';
      if (data.status.status === 'ONLINE' && data.id_operator === this.user.id) {
        this.open.next(true);
        this.isOpen = true;
        this.interval = setInterval(() => {
          this.timeout = moment().isAfter(moment(data.date_time).add(15, 'm'));
        }, 10000);
      }

      this.socketService.getMessage(WsEvents.ticket.updated)
        .subscribe(async (ticket: ITicket) => {
          if (this.ticket && this.ticket.id === ticket.id && ticket.id_operator !== this.user.id) {
            this.open.next(false);
            this.isOpen = false;
            this.toastMessage.error('ATTENZIONE! TICKET GIA ACQUISITO', 'TICKET PRESO IN CARICO DA ALTRO OPERATORE');
            this.router.navigate(['/pages/dashboard']);
          }
        });

      this.msgAlert = (data.id_operator
        && this.user.id !== data.id_operator
        && data.status.status === 'ONLINE');
    },
      (err) => {
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.ticket = null;
    clearInterval(this.interval);
  }

  async acquireTicket() {
    if (this.ticket.id_operator !== this.user.id) {
      const confirm = await this.toastMessage.warning('Vuoi acquisire il ticket?', '');
      if (confirm.value) {
        this.isOpen = this.ticket.status === 'ONLINE';
        this.updateTicketStatus(this.ticket.id_status).subscribe(() => {
          this.msgAlert = false;
          this.open.next(true);
          this.createHistoryTicketSystem('Ticket acquisito da: ' + this.user.userdata.name + ' ' + this.user.userdata.surname).subscribe();
        });
      }
    }
  }

  activateChat() {
    if (this.ticket.status === 'ONLINE' && this.ticket.id_operator !== this.user.id) {
      this.setUserChoise('Conferma Trasferimento Ticket?', 'Trasferito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    } else if (this.ticket.status === 'CLOSED') {
      this.setUserChoise('Conferma Riapertura Ticket?', 'Riapertura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    } else {
      this.setUserChoise('Conferma Presa in carico Ticket?', 'Acquisito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    }
  }

  private async setUserChoise(confirmMessage: string, historyMessage: string) {
    const confirm = await this.toastMessage.warning(confirmMessage, '');
    if (confirm.value) {
      this.updateTicketStatus(Status.ONLINE)
        .mergeMap((data) => this.createHistoryTicketSystem(historyMessage))
        .subscribe(
          () => {
            console.log('TicketHistory Subscription success');
          },
          (err) => {
            this.toastMessage.error('ERRORE', 'Errore nel ticket....' + this.ticket.id);
          });
      this.isOpen = true;
      this.msgAlert = false;
      this.open.next(true);
    }
  }

  abortChat() {
    this.location.back();
  }

  async closeChat() {
    this.updateTicketStatus(Status.CLOSED)
      .subscribe(() => {
        this.createHistoryTicketSystem('Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname)
          .subscribe(() => {
            this.location.back();
          });
      });
    // }
  }

  private async refuseChat() {
    return await swal({
      title: 'Conferma Rifiuto Chat?',
      text: 'Inserire la motivazione di questa scelta!',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Conferma',
      showLoaderOnConfirm: true,
      preConfirm: (message) => {
        return new Promise((resolve) => {
          if (!message) {
            swal.showValidationError(
              'Questo messaggio è obbligatorio.'
            );
          }
          resolve();
        });
      },
    }).then(async (result) => {
      if (result.value) {
        this.isOpen = true;
        this.updateTicketStatus(Status.REFUSED)
          .subscribe(() => {
            // tslint:disable-next-line:max-line-length
            this.createHistoryTicketSystem('Rifiutato ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname + 'per il seguente motivo: ' + result.value)
              .subscribe(() => {
                this.toastMessage.success('La Chat è stata rifiutata!', 'Rifiutata per: ' + result.value);
                this.location.back();
              });
          });
      }
    });
  }

  private createHistoryTicketSystem(message: string): Observable<ITicketHistory> {
    const createHistory: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type: HistoryTypes.SYSTEM,
      action: message,
      readed: 1
    };
    return this.apiTicketHistoryService.create(createHistory);
  }

  private updateTicketStatus(id_status: number): Observable<ITicket> {
    const updateTicket: ITicket = {
      id: this.ticket.id,
      id_status: id_status,
      id_operator: this.user.id
    };
    return this.apiTicketService.update(updateTicket as ITicket);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCloseTicket, {
      width: '80%',
      data: { ticket: this.ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (!!result) {
        this.closeChat();
      }
    });
  }

  openDialogDetail(): void {
    const dialogRef = this.dialog.open(DialogDetail, {
      width: '80%',
      data: { ticket: this.ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (!!result) {
        this.closeChat();
      }
    });
  }
}


@Component({
  selector: 'fuse-dialog-close-ticket',
  templateUrl: './dialog-close-ticket.html',
  styleUrls: ['./ticket-head.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class DialogCloseTicket {
  public call_type: ICallType[];
  public call_result: ICallResult[];
  public ticket_report: ITicketReport[];

  private user;
  public formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCloseTicket>,
    private storage: LocalStorageService,
    private apiTicketReportService: ApiTicketReportService,
    private toastMessage: ToastMessage,
    // private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.call_type = this.storage.getItem('call_type');
    this.call_result = this.storage.getItem('call_result');
    this.user = this.storage.getItem('user');
    this.ticket_report = this.data.ticket.reports.length > 0 ? _.cloneDeep(this.data.ticket.reports) : [
      {
        id_ticket: this.data.ticket.id,
        number: '',
        id_call_type: null,
        id_call_result: null
      }
    ];
    this.buildFormControl();
  }

  private buildFormControl(){
    const ctrls: any = {};
    this.ticket_report.forEach((report: ITicketReport, index: number) => {
      ctrls[`callType${index}`] = new FormControl('', Validators.required);
      ctrls[`number${index}`] = new FormControl('', Validators.compose([Validators.required, PhoneValidator.validPhone]));
      ctrls[`callResult${index}`] = new FormControl('', Validators.required);
    });
    this.formGroup = new FormGroup(ctrls);
  }

  async onYesClick() {
    if (this.formGroup.invalid) {
      return;
    }

    const confirm = await this.toastMessage.warning('Conferma chiusura Ticket?', 'Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);

    if (confirm.value) {
      this.apiTicketReportService.create(this.ticket_report)
        .subscribe(() => {
          this.dialogRef.close('true');
        });
    }
  }

  onAddItem() {
    const index = this.ticket_report.length;
    this.ticket_report.push({
      id_ticket: this.data.ticket.id,
      number: '',
      id_call_type: null,
      id_call_result: null
    });
    this.formGroup.addControl(`callType${index}`, new FormControl('', Validators.required));
    this.formGroup.addControl(`number${index}`, new FormControl('', Validators.required));
    this.formGroup.addControl(`callResult${index}`, new FormControl('', Validators.required));
  }

  onRemoveItem(index: number) {
    this.formGroup.removeControl(`callType${index}`);
    this.formGroup.removeControl(`number${index}`);
    this.formGroup.removeControl(`callResult${index}`);
    this.ticket_report.splice(index, 1);
  }

}


@Component({
  selector: 'fuse-dialog-detail',
  templateUrl: './dialog-detail.html',
  styleUrls: ['./ticket-head.component.scss']
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

export class PhoneValidator {
  static validPhone(fc: FormControl){
    if(!isNaN(fc.value)) {
      return ({PhoneValidator: true});
    } else {
      return (null);
    }
  }
}