import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Location } from '@angular/common';
import { find, orderBy } from 'lodash';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { ITicketStatus } from '../../../../../interfaces/i-ticket-status';
import swal, { SweetAlertType, SweetAlertResult } from 'sweetalert2';
import { ApiTicketHistoryService } from '../../../../services/api/api-ticket-history.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import { SocketService } from '../../../../services/socket/socket.service';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { WsEvents } from '../../../../../type/ws-events';
import { Router } from '@angular/router';
import { NormalizeTicket } from '../../../../services/helper/normalize-ticket';


@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit, OnDestroy {

  private ticketStatus: ITicketStatus;
  private apiTicketHistoryType: ITicketHistoryType;
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


  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService,
    private socketService: SocketService,
    private apiTicketHistoryService: ApiTicketHistoryService,
    private router: Router
  ) {
    this.user = this.store.getItem('user');
    this.ticketStatus = this.store.getItem('ticket_status');
    this.apiTicketHistoryType = this.store.getItem('ticket_history_type');
  }

   ngOnInit() {
    this.newTicket.subscribe(async (data: ITicket) => {
      if (this.ticket && this.ticket.status.status === 'NEW' && data.status.status !== 'NEW' && !this.isOpen) {
        await swal({
              title: 'ATTENZIONE! TICKET GIA ACQUISITO',
              text: 'TICKET PRESO IN CARICO DA ALTRO OPERATORE',
              type: 'error'
            });
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
        if (this.ticket && this.ticket.id === ticket.id && ticket.id_operator !== this.user.id){
          this.open.next(false);
          this.isOpen = false;
          await swal({
            title: 'ATTENZIONE! TICKET ACQUISITO',
            text: 'TICKET PRESO IN CARICO DA ALTRO OPERATORE',
            type: 'error'
          });
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

  activateChat() {
    if (this.ticket.status === 'ONLINE' && this.ticket.id_operator !== this.user.id) {
      this.setUserChoise('Conferma Trasferimento Ticket?', 'Trasferito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    } else if (this.ticket.status === 'CLOSED') {
      this.setUserChoise('Conferma Riapertura Ticket?', 'Riaperutra ticket da Operatore: ');
    } else {
      this.setUserChoise('Conferma acquisizione Ticket?', 'Acquisito ticket da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname);
    }

  }

  private async setUserChoise(confirmMessage: string, historyMessage: string) {
    const confirm = await this.confirmAlert(confirmMessage, '', 'warning');
    if (confirm.value) {
      this.isOpen = true;
      this.updateTicketStatus(find(this.ticketStatus, { status: 'ONLINE' }).id)
      .subscribe(
        () => {
          this.createHistoryTicketSystem(historyMessage)
            .subscribe(
              (data) => {
                console.log('TicketHistory Subscription success');
              },
              (err) => {
                swal({
                  title: 'FABRIZIO NUN CE PROVA\'',
                  text: 'Errore nel ticket....' + this.ticket.id,
                  type: 'error'
                });
              });
        },
        (err) => {
          swal({
            title: 'FABRIZIO NUN CE PROVA\'',
            text: 'Errore nel ticket....' + this.ticket.id,
            type: 'error'
          });
        });
      this.msgAlert = false;
      this.open.next(true);
    }
  }

  abortChat() {
    this.location.back();
  }

  async closeChat() {
    const confirm = await this.confirmAlert('Conferma chiusura Ticket?', 'Chiusura tichet da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname, 'warning');
    if (confirm.value) {
      this.updateTicketStatus(find(this.ticketStatus, { status: 'CLOSED' }).id)
        .subscribe(() => {
          this.createHistoryTicketSystem('Chiusura tichet da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname)
            .subscribe(() => {
              this.location.back();
            });
        });
    }
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
    }).then( async (result) => {
      if (result.value) {
        this.isOpen = true;
        this.updateTicketStatus(find(this.ticketStatus, { status: 'REFUSED' }).id)
          .subscribe(() => {
            // tslint:disable-next-line:max-line-length
            this.createHistoryTicketSystem('Rifiutato tichet da Operatore: ' + this.user.userdata.name + ' ' + this.user.userdata.surname + 'per il seguente motivo: ' + result.value)
              .subscribe(() => {
                swal({
                  type: 'success',
                  title: 'La Chat è stata rifiutata!',
                  html: 'Rifiutata per: ' + result.value
                });
                this.location.back();
              });
          });
      }
    });
  }

  private confirmAlert(title: string, text: string, type: SweetAlertType): Promise<SweetAlertResult> {
    return swal({
      title: title,
      text: text,
      type: type,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Conferma',
      cancelButtonText: 'Annulla'
    });
  }

  private createHistoryTicketSystem(message: string): Observable<ITicketHistory> {
    const createHistory: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type: find(this.apiTicketHistoryType, { type: 'SYSTEM' }).id,
      action: message,
      readed: 1
    };
    return this.apiTicketHistoryService.create(createHistory);
  }

  private updateTicketStatus(id_status: number): Observable<ITicket> {
    const updateTicket = {
      id: this.ticket.id,
      id_status: id_status,
      id_operator: this.user.id
    };
    return this.apiTicketService.update(updateTicket as ITicket);
  }
}
