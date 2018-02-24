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
  public newTicket =  new BehaviorSubject<ITicket>(this.ticket);
  public open = false;
  public ticketReason: string;
  public user;
  public badge = 0;

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
    const initMessage = find(this.ticket.historys, item => item.type.type === 'INITIAL');
    this.ticketReason = (initMessage) ? initMessage.action : '';
    if (this.ticket.status.status === 'ONLINE' && this.ticket.id_operator === this.user.id) {
      this.open = true;
    }
    this.newTicket.next(this.ticket);

    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        // data.historys = _.orderBy(data.historys, 'date_time', 'asc');
        this.newTicket.next(data);
      });

  }

  ngOnDestroy() {
    this.socketService.removeListener(WsEvents.ticketHistory.create);
  }

  async activateChat() {
    if (this.ticket.status.status === 'ONLINE' && this.ticket.id_operator !== this.user.id) {
      const confirm = await this.confirmAlert('Conferma Trasferimento Ticket?', '', 'warning');
      if (confirm.value) {
        this.updateTicketStatus(_.find(this.ticketStatus, { status : 'ONLINE'}).id);
        this.createHistoryTicketSystem(
          'Trasferito tichet da Operatore: ' + this.user.firstname + ' ' + this.user.lastname
        );
        this.open = true;
      }
    } else if (this.ticket.status.status === 'CLOSED') {
      const confirm = await this.confirmAlert('Conferma Riapertura Ticket?', '', 'warning');
      if (confirm.value) {
        this.updateTicketStatus(_.find(this.ticketStatus, { status : 'ONLINE'}).id);
        this.createHistoryTicketSystem(
          'Riaperutra tichet da Operatore: '
        );
        this.open = true;
      }
    } else {
      const confirm = await this.confirmAlert('Conferma acquisizione Ticket?', '', 'question');
      if (confirm.value) {
        this.updateTicketStatus(_.find(this.ticketStatus, { status : 'ONLINE'}).id);
        this.createHistoryTicketSystem(
          'Acquisito tichet da Operatore: ' + this.user.firstname + ' ' + this.user.lastname
        );
        this.open = true;
      }
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
    this.apiTicketHistoryService.create(createHistory);
  }

  private updateTicketStatus(id_status: number) {
    const updateTicket = { 
      id: this.ticket.id,
      id_status: id_status,
      id_operator: this.user.id
    };
    this.apiTicketService.update(updateTicket as ITicket);
  }
}
