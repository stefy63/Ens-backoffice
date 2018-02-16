///<reference path="../../../../services/api-ticket.service.ts"/>
import {Component, OnInit, OnDestroy} from '@angular/core';
import { ApiTicketService } from '../../../../services/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    // this.onChangeTickets.unsubscribe();
  }

  private ticket: ITicket[];
  private newTicket = new BehaviorSubject(this.ticket);
  private openTicket = new BehaviorSubject(this.ticket);
  private closedTicket = new BehaviorSubject(this.ticket);

  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    // private onChangeTickets: Subscription
  ) {
    // this.onChangeTickets = 
    this.apiTicket.get()
      .subscribe(
        data => {
          this.newTicket.next(_.filter(data, item => {return item.status.id === 1;}));
          this.openTicket.next(_.filter(data, item => {return item.status.id === 2;}));
          this.closedTicket.next(_.filter(data, item => {return item.status.id === 3;}));
        }
      );
  }

  ngOnInit() {
  }
}
