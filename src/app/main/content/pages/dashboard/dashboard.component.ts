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
  public options = ToastOptions;

  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private toast: NotificationsService,
    private spinner: NgxSpinnerService,

  ) {
    this.idOperator = this.storage.getItem('user').id;
    this.beep = new Audio('../../../../assets/audio/beep.wav');
  }

  ngOnInit() {
    this.tabChangedSubject.pipe(
      tap((index: number) => this.spinner.show()),
      mergeMap((status: number) => this.loadTicketsWith(status)),
      map((tickets: ITicket[]) => NormalizeTicket.normalizeItem(tickets)),
      tap((tickets) => {
        this.tableTickets.next(tickets);
        this.spinner.hide();
      })
    ).subscribe();

    this.socketService.getMessage(WsEvents.ticket.create)
      .subscribe((data: ITicket) => {
        if (this.currentStatus === Status.NEW) {
          this.tabChangedSubject.next(this.currentTabIndex);
        }

        const newUserSurname = (data.id_user != null) ? data.user.userdata.surname : 'Unknown';
        const message = this.toast.info('Nuovo Ticket!', 'Nuovo ticket da ' + newUserSurname);
        message.click.subscribe((event) => {
          this.tabGroup.selectedIndex = 0;
        });

        this.beep.load();
        this.beep.play();
      });

    this.socketService.getMessage(WsEvents.ticketHistory.create).subscribe((ticket: ITicket) => {
        if (ticket.operator.id === this.idOperator && this.currentTabIndex === this.MINE_TICKETS_TAB) {
          this.tabChangedSubject.next(this.currentTabIndex);
        }
    });

    this.socketService.getMessage(WsEvents.ticket.updated).subscribe(() => {
        this.tabChangedSubject.next(this.currentTabIndex);
    });
  }

  ngOnDestroy(): void {
    this.socketService.removeListener(WsEvents.ticket.create);
    this.socketService.removeListener(WsEvents.ticket.updated);
    this.socketService.removeListener(WsEvents.ticketHistory.create);
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
      return this.apiTicket.getWithCriterias(environment.APP_TICKET_RETENTION_DAY, this.currentStatus, this.idOperator);
    }

    return this.apiTicket.getWithCriterias(environment.APP_TICKET_RETENTION_DAY, this.currentStatus);
  }

}
