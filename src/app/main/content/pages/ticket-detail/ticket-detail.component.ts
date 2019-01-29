import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiTicketService } from '../../../services/api/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SocketService } from '../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { Services } from '../../../../enums/ticket-services.enum';
import { Status } from '../../../../enums/ticket-status.enum';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'fuse-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy {

  public idTicket: number;
  public service: string;
  public ticket = new BehaviorSubject<ITicket>(this.ticket);
  public isVideochat = false;
  public open = false;
  public user;
  public status;
  private updatingTicketSubscription: Subscription;
  private messageCreatedSubscription: Subscription;
  private lastTicket: ITicket;

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
    this.messageCreatedSubscription = this.socketService.getMessage(WsEvents.ticketHistory.create)
      .debounceTime(500)
      .filter((data: ITicket) => data.id === this.idTicket)
      .subscribe((data: ITicket) => {
        this.ticket.next(_.assign({}, this.lastTicket, data));
      });

    this.updatingTicketSubscription = Observable.merge(
      this.apiTicket.getFromId(this.idTicket),
      this.socketService.getMessage(WsEvents.ticket.updated)
    ).subscribe((data: ITicket) => {
      this.lastTicket = data;
      this.ticket.next(data);
      this.service = data.service.service;
      this.isVideochat = data.id_service === Services.VIDEOCHAT;
      this.open = _.includes([Status.ONLINE, Status.REFUSED, Status.CLOSED], data.id_status);
      this.status = data.status.status;
    });
  }

  ngOnDestroy() {
    if (this.updatingTicketSubscription) {
      this.updatingTicketSubscription.unsubscribe();
    }
    if (this.messageCreatedSubscription) {
      this.messageCreatedSubscription.unsubscribe();
    }
  }

  setOpen($event) {
    this.open = $event;
  }
}
