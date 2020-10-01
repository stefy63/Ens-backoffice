import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
import { NotificationsService } from 'angular2-notifications';
import * as _ from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { Status } from '../../../../enums/ticket-status.enum';
import { ITicket } from '../../../../interfaces/i-ticket';
import { WsEvents } from '../../../../type/ws-events';
import { ApiTicketService } from '../../../services/api/api-ticket.service';
import { NormalizeTicket } from '../../../services/helper/normalize-ticket';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('tabGroup') tabGroup: any;
  private idOperator: number;
  public totalBadge = 0;
  public beep;
  public currentTabIndex: number;
  public tabChangedSubject: BehaviorSubject<number>;
  public tableTickets: Subject<ITicket[]> = new Subject<ITicket[]>();
  public currentStatus: Status = Status.NEW;
  private MINE_TICKETS_TAB = 4;
  private newTicketSubscription: Subscription;
  private tabChangedSubscription: Subscription;
  private newHistoryTicketSubscription: Subscription;
  private updatingTicketSubscription: Subscription;

  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private toast: NotificationsService,
    private spinner: NgxSpinnerService,

  ) {
    this.idOperator = this.storage.getItem('user').id;
    this.beep = new Audio('/assets/audio/' + environment.beep_alarm);
    this.currentTabIndex = parseInt(this.storage.getKey('dashboard_selected_tabindex'), 10) || 0;
    this.tabChangedSubject = new BehaviorSubject<number>(this.currentTabIndex);
    
  }

  ngOnInit() {
    if (this.currentTabIndex) {
      this.tabGroup.selectedIndex = this.currentTabIndex;
    }

    this.tabChangedSubscription = this.tabChangedSubject.pipe(
      tap(() => this.spinner.show()),
      mergeMap((status: number) => this.loadTicketsWith(status)),
      map((tickets: ITicket[]) => NormalizeTicket.normalizeItems(tickets)),
      tap((tickets) => {
        this.tableTickets.next(tickets);
        this.spinner.hide();
      })
    ).subscribe();

    this.newTicketSubscription = this.socketService.getMessage(WsEvents.ticket.create)
      .subscribe((data: ITicket) => {
        if (this.currentStatus === Status.NEW) {
          this.tabChangedSubject.next(this.currentTabIndex);
        }

        const newUserSurname = (_.get(data, 'user.userdata.surname', null)) ? data.user.userdata.surname : 'Unknown';
        const message = this.toast.info('Nuovo Ticket!', 'Nuovo ticket da ' + newUserSurname);
        message.click.subscribe((event) => {
          this.tabGroup.selectedIndex = 0;
        });

        this.beep.load();
        this.beep.play();
      });

    this.newHistoryTicketSubscription = this.socketService.getMessage(WsEvents.ticketHistory.create).subscribe((ticket: ITicket) => {
      if (ticket.id_operator === this.idOperator && this.currentTabIndex === this.MINE_TICKETS_TAB) {
        this.tabChangedSubject.next(this.currentTabIndex);
      }
    });

    this.updatingTicketSubscription = this.socketService.getMessage(WsEvents.ticket.updated).subscribe((ticket: ITicket) => {
      this.beep.pause();
      if (ticket.id_operator !== this.idOperator && this.currentTabIndex === this.MINE_TICKETS_TAB) {
        return;
      }
      this.tabChangedSubject.next(this.currentTabIndex);
    });
  }

  ngOnDestroy(): void {
    this.beep.pause();
    this.beep = null;
    if (this.newTicketSubscription) {
      this.newTicketSubscription.unsubscribe();
    }
    if (this.tabChangedSubscription) {
      this.tabChangedSubscription.unsubscribe();
    }
    if (this.newHistoryTicketSubscription){
      this.newHistoryTicketSubscription.unsubscribe();
    }
    if (this.updatingTicketSubscription){
      this.updatingTicketSubscription.unsubscribe();
    }
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    this.storage.setItem('dashboard_selected_tabindex', tabChangeEvent.index.toString());
    this.currentTabIndex = tabChangeEvent.index;
    this.tabChangedSubject.next(tabChangeEvent.index);
  }

  private loadTicketsWith(statusId: number): Observable<ITicket[]> {
    const tabsToStatus: Status[] = [Status.NEW, Status.ONLINE, Status.CLOSED, Status.REFUSED, Status.ONLINE];
    this.currentStatus = tabsToStatus[statusId];
    if (statusId === this.MINE_TICKETS_TAB) {
      return this.apiTicket.getWithCriterias({
        mapped: environment.APP_TICKET_RETENTION_DAY.toString(),
        id_status: this.currentStatus.toString(),
        id_user: this.idOperator.toString()
      });
    }

    return this.apiTicket.getWithCriterias({
      mapped: environment.APP_TICKET_RETENTION_DAY.toString(),
      id_status: this.currentStatus.toString()
    });
  }



}
