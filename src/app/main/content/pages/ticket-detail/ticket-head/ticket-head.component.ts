import { ComponentType } from '@angular/cdk/portal';
import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { assign, find } from 'lodash';
import * as moment from 'moment-timezone';
import 'rxjs/add/operator/mergeMap';
import { Observable } from 'rxjs/Observable';
import { flatMap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import swal from 'sweetalert2';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';
import { Status } from '../../../../../enums/ticket-status.enum';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { ApiTicketHistoryService } from '../../../../services/api/api-ticket-history.service';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { NormalizeTicket } from '../../../../services/helper/normalize-ticket';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ToastMessage } from '../../../../services/toastMessage.service';
import { DialogCloseTicket } from './dialog-component/dialog-close.component';
import { DialogDetail } from './dialog-component/dialog-detail.component';

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
  public ticketNotNormalized: any;
  public ticketReason: string;
  public user;
  public badge = 0;
  public msgAlert: boolean;
  public isOpen = false;
  public timeout = false;
  public phone: string;
  private ticketSubscription: Subscription;


  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService,
    private apiTicketHistoryService: ApiTicketHistoryService,
    public dialog: MatDialog,
    private toastMessage: ToastMessage
  ) {
    this.user = this.store.getItem('user');
  }

  ngOnInit() {
    this.ticketSubscription = this.newTicket.subscribe((data: ITicket) => {
      if (this.ticket && this.ticket.id_status === Status.NEW && data.id_status !== Status.NEW && !this.isOpen) {
        this.toastMessage.error('ATTENZIONE! TICKET GIA ACQUISITO', 'TICKET PRESO IN CARICO DA ALTRO OPERATORE');
        this.location.back();
      }

      this.ticketNotNormalized = data;
      this.ticket = NormalizeTicket.normalizeItems([data])[0];
      const initMessage = find(data.historys, item => item.id_type === HistoryTypes.INITIAL);
      this.ticketReason = (initMessage) ? initMessage.action : '';
      if (data.id_status === Status.ONLINE && data.id_operator === this.user.id) {
        this.open.next(true);
        this.isOpen = true;
        const date_acquisition: ITicketHistory = _.chain(data.historys)
                .filter(elem => elem.id_type === HistoryTypes.SYSTEM && elem.action.includes('Acquisito'))
                .orderBy(['date_time'], ['ASC'])
                .findLast()
                .value() || '';
        this.interval = setInterval(() => {
          this.timeout = moment().tz('Europe/Rome').isAfter(moment(date_acquisition.date_time).add(15, 'm'));
        }, 10000);
      }

      this.msgAlert = (data.id_operator && this.user.id !== data.id_operator && data.id_status === Status.ONLINE);
    }, (err) => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe();
    }
    clearInterval(this.interval);
  }

  async acquireTicket() {
    if (this.ticket.id_operator !== this.user.id) {
      const confirm = await this.toastMessage.warning('Vuoi acquisire il ticket?', '');
      if (confirm.value) {
        this.isOpen = this.ticket.id_status === Status.ONLINE;
        this.updateTicketStatus(this.ticketNotNormalized.id_status).subscribe(() => {
          this.msgAlert = false;
          this.open.next(true);
          this.createHistoryTicketSystem(`Ticket acquisito da: ${this.user.userdata.name} ${this.user.userdata.surname}`).subscribe();
        }, (error) => {
          this.toastMessage.error(
            'Errore Acquisizione Ticket',
            (error.message && error.message === 'TICKET_ALREADY_ONLINE') ? `Ticket già gestito da un altro operatore` : `Errore generico`);
        });
      }
    }
  }

  activateChat() {
    if (this.ticket.id_status === Status.ONLINE && this.ticket.id_operator !== this.user.id) {
      this.setUserChoise('Conferma Trasferimento Ticket?', 'Trasferito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname, true);
    } else if (this.ticket.id_status === Status.CLOSED) {
      this.setUserChoise('Conferma Riapertura Ticket?', 'Riapertura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname, true);
    } else {
      this.setUserChoise('Conferma Presa in carico Ticket?', 'Acquisito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname, true);
    }
  }

  private async setUserChoise(confirmMessage: string, historyMessage: string, force?: boolean) {
    const confirm = await this.toastMessage.warning(confirmMessage, '');
    if (confirm.value) {
      this.updateTicketStatus(Status.ONLINE)
      .mergeMap((data) => this.createHistoryTicketSystem(historyMessage))
      .subscribe(() => {
        console.log('TicketHistory Subscription success');
      }, (err) => {
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
    .pipe(flatMap(() => this.createHistoryTicketSystem('Chiusura ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname)))
    .subscribe(() => {
      this.location.back();
    });
  }

  private async refuseChat() {
    return await swal({
      title: 'Conferma Rifiuto Ticket?',
      text: 'Inserire la motivazione di questa scelta!',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Conferma',
      showLoaderOnConfirm: true,
      preConfirm: async(message) => {
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
                this.toastMessage.success('Il ticket è stato rifiutato!', 'Rifiutata per: ' + result.value);
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

  private updateTicketStatus(id_status: number, force?: boolean): Observable<ITicket> {
    const updateTicket: ITicket = assign({}, this.ticketNotNormalized, {
      id_status: id_status,
      id_operator: this.user.id,
    });

    return this.apiTicketService.update(updateTicket as ITicket, force);
  }

  openDialogDetail(close: boolean): void {
    const dialog: ComponentType<DialogCloseTicket | DialogDetail> = this.isOpen ? DialogCloseTicket : DialogDetail;
    const dialogRef = this.dialog.open(dialog, {
      width: '80%',
      data: { ticket: this.ticket }
    });

    if (!close){
      return;
    }
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.closeChat();
      }
    });
  }


}
