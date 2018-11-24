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
  public status;
  private updatingTicketSubscription: Subscription;

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
        if (data.service.service !== 'VIDEOCHAT' && (
          (data.status.status === 'REFUSED' ||
            data.status.status === 'CLOSED' ||
            data.status.status === 'ONLINE') &&
          data.id_operator === this.user.id)) { // FIXME: this predicate must be semplify, in particolar open is meaningless
          this.open = true;
          this.status = data.status.status;
        }
      }, (err) => {
        console.log(err);
      });

    this.updatingTicketSubscription = Observable.merge(
      this.socketService.getMessage(WsEvents.ticketHistory.create),
      this.socketService.getMessage(WsEvents.ticket.updated),
    ).subscribe((data: ITicket) => {
      if (data.id === this.idTicket) {
        this.ticket.next(data);
        this.status = data.status.status;
      }
    }, (err) => {
      console.log(err);
    });
  }

  ngOnDestroy() {
    if (this.updatingTicketSubscription) {
      this.updatingTicketSubscription.unsubscribe();
    }
  }

  setOpen($event) {
    this.open = $event;
  }
}
