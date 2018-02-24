///<reference path="../../../../services/api/api-ticket.service.ts"/>
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiTicketService } from '../../../../services/api/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import { SocketService } from '../../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { NotificationsService, SimpleNotificationsComponent } from 'angular2-notifications';
import { ToastOptions } from '../../../../type/toast-options';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private ticket: ITicket[];
  private idOperator: number;
  public newTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public openTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public closedTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public myOpenTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public totalBadge = 0;
  public options = ToastOptions;


  ngOnDestroy(): void {
    this.socketService.removeListener(WsEvents.ticket.create);
    this.socketService.removeListener(WsEvents.ticket.updated);
  }


   constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private toast: NotificationsService
  ) {
    this.idOperator = this.storage.getItem('user').id;
  }

  async ngOnInit() {
    this.ticket = await this.apiTicket.get();
    this._setDataOutput();
    this.socketService.getMessage(WsEvents.ticket.create)
      .subscribe((data) => {
        this.ticket.push(data as ITicket);
        this._setDataOutput();
        this.toast.info('Nuovo Ticket!', 'Nuovo ticket da ' + (data as ITicket).user.surname);
      });
    this.socketService.getMessage(WsEvents.ticket.updated)
      .subscribe((data) => {
        const index = _.findIndex(this.ticket, item => item.id === (data as ITicket).id);
        if (index) {
          this.ticket.splice(index, 1, data as ITicket);
        }
        this._setDataOutput();
        this.toast.info('Ticket Modificato', 'Il ticket di ' + (data as ITicket).user.surname + ' è stato modificato!');
      });
  }

  private badgeUpdate(badge) {
    this.totalBadge = badge; 
  }



  private _setDataOutput() {
    this.newTicket.next(_.filter(this.ticket, item => item.id_status === 1));
    this.openTicket.next(_.filter(this.ticket, item => item.id_status === 2));
    this.closedTicket.next(_.filter(this.ticket, item => item.id_status === 3));
    this.myOpenTicket.next(_.filter(this.ticket, item => item.id_status === 2 && item.id_operator === this.idOperator));
  }
}
