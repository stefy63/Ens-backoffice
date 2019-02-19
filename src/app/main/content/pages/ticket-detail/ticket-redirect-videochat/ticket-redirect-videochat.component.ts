import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Status } from '../../../../../enums/ticket-status.enum';
import * as _ from 'lodash';

@Component({
  selector: 'fuse-ticket-redirect-videochat',
  templateUrl: './ticket-redirect-videochat.component.html',
  styleUrls: ['./ticket-redirect-videochat.component.scss']
})
export class TicketRedirectVideochatComponent implements OnInit, OnDestroy {
  @Input('ticket') data: Observable<ITicket>;
  public ticket: ITicket;
  private ticketSubscription: Subscription;
  public videochatRunnable = false;
  public showRoom: String = '';

  constructor() { }

  ngOnInit() {
    this.ticketSubscription = this.data.subscribe((item: ITicket) => {
      this.ticket = item;
      this.videochatRunnable = !_.includes([Status.REFUSED, Status.CLOSED], this.ticket.id_status);
      this.showRoom = 'https://appear.in/comunicaens_op' + item.id_operator;
    }, (err) => {
      console.error(err);
    });
  }

  ngOnDestroy(): void {
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe();
    }
  }
}
