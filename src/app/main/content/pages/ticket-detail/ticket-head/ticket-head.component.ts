import { Component, OnInit, Input } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import {Location} from '@angular/common';
import { find } from 'lodash';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { IUser } from '../../../../../interfaces/i-user';
import { ITicketService } from '../../../../../interfaces/i-ticket-service';
import { ApiTicketService } from '../../../../../services/api/api-ticket.service';
import { ITicketStatus } from '../../../../../interfaces/i-ticket-status';
import * as _ from 'lodash';

@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit {

  @Input('openTicket') ticket:  ITicket;
  public open = false;
  public ticketReason: string;
  public user: IUser;
  private ticketStatus: ITicketStatus;

  constructor(
    private location: Location,
    private store: LocalStorageService,
    private apiTicketService: ApiTicketService
  ) {
    this.user = this.store.getItem('user');
    this.ticketStatus = this.store.getItem('ticket_status');
    }

  ngOnInit() {
    this.ticketReason = find(this.ticket.historys, item => item.type.type === 'INITIAL').action || '';
    if (this.ticket.status.status === 'ONLINE' && this.ticket.id_operator === this.user.id) {
      this.open = true;
    } 
 
  }

  activateChat() {

  }

  deleteChat() {
    this.location.back();
  }

  closeChat() {
    const updateTicket = { 
      id: this.ticket.id,
      id_status: _.find(this.ticketStatus, { status : 'CLOSED'}).id
    };
    // this.ticket.id_status = _.find(this.ticketStatus, { status : 'CLOSED'}).id;
    this.apiTicketService.update(updateTicket as ITicket);
    this.location.back();
  }
}
