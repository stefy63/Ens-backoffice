import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Location } from '@angular/common';
import { find } from 'lodash';
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


@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit {

  private ticketStatus: ITicketStatus;
  private apiTicketHistoryType: ITicketHistoryType;

  @Input('ticket') newTicket: Observable<ITicket>;
  @Output('open') open: EventEmitter<boolean> = new EventEmitter();
  public ticket: ITicket;
  public ticketReason: string;
  public user;
  public badge = 0;
  public msgAlert: boolean;
  public isOpen = false;


  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService,
    private socketService: SocketService,
    private apiTicketHistoryService: ApiTicketHistoryService
  ) {
    this.user = this.store.getItem('user');
    this.ticketStatus = this.store.getItem('ticket_status');
    this.apiTicketHistoryType = this.store.getItem('ticket_history_type');
  }

  ngOnInit() {
    this.newTicket.subscribe((data: ITicket) => {
      this.ticket = data;
      const initMessage = find(data.historys, item => item.type.type === 'INITIAL');
      this.ticketReason = (initMessage) ? initMessage.action : '';
      if (data.status.status === 'ONLINE' && data.id_operator === this.user.id) {
        this.open.next(true);
        this.isOpen = true;
      }
      this.msgAlert = (data.id_operator
        && this.user.id !== data.id_operator
        && data.status.status === 'ONLINE');
    });
  }


  activateChat() {
    if (this.ticket.status.status === 'ONLINE' && this.ticket.id_operator !== this.user.id) {
      this.setUserChoise('Conferma Trasferimento Ticket?', 'Trasferito tichet da Operatore: ' + this.user.firstname + ' ' + this.user.lastname);
    } else if (this.ticket.status.status === 'CLOSED') {
      this.setUserChoise('Conferma Riapertura Ticket?', 'Riaperutra tichet da Operatore: ');
    } else {
      this.setUserChoise('Conferma acquisizione Ticket?', 'Acquisito tichet da Operatore: ' + this.user.firstname + ' ' + this.user.lastname);
    }

  }

  private async setUserChoise(confirmMessage: string, historyMessage: string) {
    const confirm = await this.confirmAlert(confirmMessage, '', 'warning');
    if (confirm.value) {
      this.updateTicketStatus(find(this.ticketStatus, { status: 'ONLINE' }).id);
      this.createHistoryTicketSystem(historyMessage);
      this.msgAlert = false;
      this.open.next(true);
      this.isOpen = true;
    }
  }

  abortChat() {
    this.location.back();
  }

  closeChat() {
    this.updateTicketStatus(find(this.ticketStatus, { status: 'CLOSED' }).id);
    this.location.back();
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

  private refuseChat() {
    return swal({
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
      // allowOutsideClick: () => !swal.isLoading()
    }).then((result) => {
      if (result.value) {
        swal({
          type: 'success',
          title: 'La Chat è stata rifiutata!',
          html: 'Rifiutata per: ' + result.value
        });
        this.updateTicketStatus(find(this.ticketStatus, { status: 'REFUSED' }).id);
        this.createHistoryTicketSystem(
          'Rifiutato tichet da Operatore: ' + this.user.firstname + ' ' + this.user.lastname + 'per il seguente motivo: ' + result.value);
        this.location.back();
      }
    });
  }

  private createHistoryTicketSystem(message: string) {
    const createHistory: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type: find(this.apiTicketHistoryType, { type: 'SYSTEM' }).id,
      action: message,
      readed: 1,
      date_time: moment().toISOString()
    };
    this.apiTicketHistoryService.create(createHistory).subscribe();
  }

  private updateTicketStatus(id_status: number) {
    const updateTicket = {
      id: this.ticket.id,
      id_status: id_status,
      id_operator: this.user.id
    };
    return this.apiTicketService.update(updateTicket as ITicket).subscribe();
  }
}
