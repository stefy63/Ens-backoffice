import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiTicketService} from '../../../../services/api/api-ticket.service';
import {ITicket} from '../../../../interfaces/i-ticket';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SocketService } from '../../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';

@Component({
  selector: 'fuse-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy {

  public idTicket: number;
  public service: string;
  public ticket = new BehaviorSubject<ITicket>(this.ticket);
  public open = false;
  public user;

  constructor(
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private apiTicket: ApiTicketService,
    private socketService: SocketService,
  ) {
    // tslint:disable-next-line:radix
    this.idTicket = parseInt(this.route.snapshot.paramMap.get('id'));
    this.user = this.storage.getItem('user');
  }

  ngOnInit() {
    this.apiTicket.getFromId(this.idTicket)
      .subscribe((data: ITicket) => {
        this.ticket.next(data);
        this.service = data.service.service;
        if (data.status.status === 'ONLINE' && data.id_operator === this.user.id) {
          this.open = true;
        }

      });

    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        if (data.id === this.idTicket) {
          this.ticket.next(data);
          // if (data.status.status === 'ONLINE' && data.id_operator === this.user.id) {
          //   this.open = true;
          // }
        }
    });

  }

  ngOnDestroy() {
    this.socketService.removeListener(WsEvents.ticketHistory.create);
  }

}
