///<reference path="../../../../services/api/api-ticket.service.ts"/>
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import { SocketService } from '../../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { ToastOptions } from '../../../../type/toast-options';
import { MatTabChangeEvent } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabGroup') tabGroup: any;
  private ticket: ITicket[];
  private idOperator: number;
  public newTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public openTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public closedTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public refusedTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public myOpenTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public totalBadge = 0;
  public options = ToastOptions;

  
  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private toast: NotificationsService,
  ) {
    this.idOperator = this.storage.getItem('user').id;    
  }

  ngOnInit() {
    this.apiTicket.get()
        .subscribe(data => {
          this.ticket = data;
          this._setDataOutput();
        });
    this.socketService.getMessage(WsEvents.ticket.create)
      .subscribe((data: ITicket) => {
        this.ticket.push(data);
        this._setDataOutput();
        this.toast.info('Nuovo Ticket!', 'Nuovo ticket da ' + data.user.surname);
      });
    this.socketService.getMessage(WsEvents.ticket.updated)
      .subscribe((data: ITicket) => {
        const index = _.findIndex(this.ticket, item => item.id === data.id);
        if (index) {
          this.ticket.splice(index, 1, data);
        }
        this._setDataOutput();
        this.toast.info('Ticket Modificato', 'Il ticket ' + data.id + ' è stato modificato!');
      });
  }

  public badgeUpdate(badge) {
    this.totalBadge = badge; 
  }

  ngOnDestroy(): void {
    this.socketService.removeListener(WsEvents.ticket.create);
    this.socketService.removeListener(WsEvents.ticket.updated);
  }

  ngAfterViewInit() {
    const selectedIndex = this.storage.getKey('dashboard_selected_tabindex');
    if (selectedIndex) {
      this.tabGroup.selectedIndex = +selectedIndex;
    }
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.storage.setItem('dashboard_selected_tabindex', tabChangeEvent.index.toString());
  }

  private _setDataOutput() {
    const returnTickets = this.apiTicket.normalizeTickets(this.ticket);
    this.newTicket.next(_.filter(returnTickets, item => item.status === 'NEW'));
    this.openTicket.next(_.filter(returnTickets, item => item.status === 'ONLINE' && item.id_operator !== this.idOperator));
    this.closedTicket.next(_.filter(returnTickets, item => item.status === 'CLOSED'));
    this.refusedTicket.next(_.filter(returnTickets, item => item.status === 'REFUSED'));
    this.myOpenTicket.next(_.filter(returnTickets, item => item.status === 'ONLINE' && item.id_operator === this.idOperator));

    // this.newTicket.next(_.filter(this.ticket, item => item.status.status === 'NEW'));
    // this.openTicket.next(_.filter(this.ticket, item => item.status.status === 'ONLINE' && item.id_operator !== this.idOperator));
    // this.closedTicket.next(_.filter(this.ticket, item => item.status.status === 'CLOSED'));
    // this.myOpenTicket.next(_.filter(this.ticket, item => item.status.status === 'ONLINE' && item.id_operator === this.idOperator));
  }
}
