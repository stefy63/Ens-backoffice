import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ApiTicketService } from '../../../services/api/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SocketService } from '../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { NotificationsService } from 'angular2-notifications';
import { MatTabChangeEvent } from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { NormalizeTicket } from '../../../services/helper/normalize-ticket';
import { mergeMap, tap, map } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/Observable';
import { Status } from '../../../../enums/ticket-status.enum';
import { ToastOptions } from '../../../../type/toast-options';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabGroup') tabGroup: any;
  private idOperator: number;
  public totalBadge = 0;
  public beep;
  public currentTabIndex: number = this.storage.getItem('dashboard_selected_tabindex') || 0;
  public tabChangedSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.currentTabIndex);
  public tableTickets: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>([]);
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
  }

  ngOnInit() {
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

  ngAfterViewInit() {
    const selectedIndex = this.storage.getKey('dashboard_selected_tabindex');
    if (selectedIndex) {
      this.tabGroup.selectedIndex = +selectedIndex;
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
