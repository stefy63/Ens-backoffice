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

  constructor(
    private route: ActivatedRoute,
    private storage: LocalStorageService,
    private apiTicket: ApiTicketService,
    private socketService: SocketService,
    private spinner: NgxSpinnerService,
  ) {
    // tslint:disable-next-line:radix
    this.idTicket = parseInt(this.route.snapshot.paramMap.get('id'));
    this.user = this.storage.getItem('user');
  }

  ngOnInit() {
    this.updatingTicketSubscription = Observable.merge(
      this.socketService.getMessage(WsEvents.ticketHistory.create),
      this.socketService.getMessage(WsEvents.ticket.updated),
      Observable.of({id: this.idTicket})
    )
    .debounceTime(200)
    .filter((data: ITicket) => data.id === this.idTicket)
    .do(() => this.spinner.show())
    .flatMap((data: ITicket) => this.apiTicket.getFromId(this.idTicket))
    .subscribe((data: ITicket) => {
      this.spinner.hide();
      this.ticket.next(data);
      this.service = data.service.service;
      this.isVideochat = data.id_service === Services.VIDEOCHAT;
      this.open = _.includes([Status.ONLINE, Status.REFUSED, Status.CLOSED], data.id_status);
      this.status = data.status.status;
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
