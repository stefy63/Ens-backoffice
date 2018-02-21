import { Component, OnInit, Input } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import {Location} from '@angular/common';

@Component({
  selector: 'fuse-ticket-head',
  templateUrl: './ticket-head.component.html',
  styleUrls: ['./ticket-head.component.scss']
})
export class TicketHeadComponent implements OnInit {

  @Input('openTicket') ticket:  ITicket;
  public open = true;
  public ticketReason: string;

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
    this.ticketReason = (this.ticket.historys[0]) ? this.ticket.historys[0].action : '';
  }

  activateChat() {

  }

  deleteChat() {
    this.location.back();
  }
}
