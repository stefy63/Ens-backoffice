import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import {Location} from '@angular/common';
import { find } from 'lodash';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { IUser } from '../../../../../interfaces/i-user';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';
import { ApiTicketService } from '../../../../../services/api/api-ticket.service';
import { ITicketStatus } from '../../../../../interfaces/i-ticket-status';
import * as _ from 'lodash';
import swal, { SweetAlertType, SweetAlertResult } from 'sweetalert2'; // sweetalert2.github.io
import { ApiTicketHistoryService } from '../../../../../services/api/api-ticket-history.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import { SocketService } from '../../../../../services/socket/socket.service';
import { WsEvents } from '../../../../../type/ws-events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit, OnDestroy {

  private ticketStatus: ITicketStatus;
  private apiTicketHistoryType: ITicketHistoryType;

  @Input('openTicket') ticket:  ITicket;
  public newTicket =  new BehaviorSubject<ITicket>(this.newTicket);
  public open = false;
  public ticketReason: string;
  public user;
  public badge = 0;
  public msgAlert: boolean;

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
    const initMessage = _.find(this.ticket.historys, item => item.type.type === 'INITIAL');
    this.ticketReason = (initMessage) ? initMessage.action : '';
    if (this.ticket.status.status === 'ONLINE' && this.ticket.id_operator === this.user.id) {
      this.open = true;
    }
    this.newTicket.next(this.ticket);
    this.msgAlert = (this.ticket.id_operator 
                      &&  this.user.id !== this.ticket.id_operator 
                      && this.ticket.status.status === 'ONLINE');

    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        this.newTicket.next(data);
      });

  }

  ngOnDestroy() {
    this.socketService.removeListener(WsEvents.ticketHistory.create);
  }

  async activateChat() {
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
      this.updateTicketStatus(_.find(this.ticketStatus, { status : 'ONLINE'}).id);
      this.createHistoryTicketSystem(historyMessage);
      this.open = true;
      this.msgAlert = false;
    }
  }

  abortChat() {
    this.location.back();
  }

  closeChat() {
    this.updateTicketStatus(_.find(this.ticketStatus, { status : 'CLOSED'}).id);
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

   private createHistoryTicketSystem(message: string) {
    const createHistory: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type:  _.find(this.apiTicketHistoryType, { type : 'SYSTEM'}).id,
      action: message,
      readed: 1,
      date_time: new Date().toISOString()
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
