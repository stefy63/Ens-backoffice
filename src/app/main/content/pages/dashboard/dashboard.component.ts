import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ApiTicketService } from '../../../services/api/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../services/local-storage/local-storage.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as _ from 'lodash';
import { SocketService } from '../../../services/socket/socket.service';
import { WsEvents } from '../../../../type/ws-events';
import { NotificationsService } from 'angular2-notifications';
import { ToastOptions } from '../../../../type/toast-options';
import { MatTabChangeEvent } from '@angular/material';
import * as moment from 'moment';
import { environment } from '../../../../../environments/environment';
import { NormalizeTicket } from '../../../services/helper/normalize-ticket';
import { mergeMap, tap, map, merge, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tabGroup') tabGroup: any;
  private ticket: ITicket[];
  private idOperator: number;
  // public newTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  // public openTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  // public closedTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  // public refusedTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  // public myOpenTicket: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>(this.ticket);
  public totalBadge = 0;
  public options = ToastOptions;
  public beep;
  public currentTabIndex: number =  this.storage.getItem('dashboard_selected_tabindex') || 0;
  public tabChangedSubject: BehaviorSubject<number> =  new BehaviorSubject<number>(this.currentTabIndex);
  public tableTickets: BehaviorSubject<ITicket[]> = new BehaviorSubject<ITicket[]>([]);


  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private toast: NotificationsService,
    private spinner: NgxSpinnerService,

  ) {
    this.idOperator = this.storage.getItem('user').id;
    this.beep = new Audio();
    this.beep.src = '../../../../assets/audio/beep.wav';
  }

  ngOnInit() {
    this.tableTickets.pipe(
      switchMap((tickets) => Observable.interval(60000)),
      tap(() => this.tabChangedSubject.next(this.currentTabIndex))
    ).subscribe();

    this.tabChangedSubject.pipe(
    tap((index: number) => this.spinner.show()),
    mergeMap((status: number) => this._setDataOutput(status)),
    map((tickets: ITicket[]) => NormalizeTicket.normalizeItem(tickets)),
    tap((tickets) => {
      this.tableTickets.next(tickets);
      this.spinner.hide();
    })).subscribe();

    // this.apiTicket.getFromDate(environment.APP_TICKET_RETENTION_DAY)
    //     .subscribe(data => {
    //       this.ticket = NormalizeTicket.normalizeItem(data);
    //       this._setDataOutput(this.ticket);
    //     });

    this.socketService.getMessage(WsEvents.ticket.create)
      .subscribe((data: ITicket) => {
        this.tabChangedSubject.next(this.currentTabIndex);

        // this.ticket.push(NormalizeTicket.normalizeItem([data])[0]);
        // this._setDataOutput(this.ticket);
        const newUserSurname = (data.id_user != null) ? data.user.userdata.surname : 'Unknown';
        const message = this.toast.info('Nuovo Ticket!', 'Nuovo ticket da ' + newUserSurname);
        this.beep.load();
        this.beep.play();
        message.click.subscribe((e) => {
          this.tabGroup.selectedIndex = 0;
        });
      });

    this.socketService.getMessage(WsEvents.ticket.updated)
      .subscribe((data: ITicket) => {
        this.tabChangedSubject.next(this.currentTabIndex);

        // const index = _.findIndex(this.ticket, item => item.id === data.id);
        // if (index >= 0) {
        //   this.ticket.splice(index, 1, NormalizeTicket.normalizeItem([data])[0]);
        // }
        // this._setDataOutput(this.ticket);
        // // this.toast.info('Ticket Modificato', 'Il ticket ' + data.id + ' è stato modificato!');
      });
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
    this.tabChangedSubject.next(tabChangeEvent.index);
  }

  // private _setDataOutput(data: ITicket[]) {
  //   // const returnTickets = this.apiTicket.normalizeTickets(this.ticket);
  //   const returnTickets: ITicket[] = _.map(data, item => {
  //           item.closed_at = (item.closed_at) ? moment.utc(item.closed_at.date_time).format('DD/MM/YYYY HH:mm') : undefined;
  //           return item;
  //         });
  //   this.newTicket.next( _.filter(returnTickets, item => item.status === 'NEW'));
  //   this.openTicket.next(_.filter(returnTickets, item => item.status === 'ONLINE' && item.id_operator !== this.idOperator));
  //   this.closedTicket.next(_.filter(returnTickets, item => item.status === 'CLOSED'));
  //   this.refusedTicket.next(_.filter(returnTickets, item => item.status === 'REFUSED'));
  //   this.myOpenTicket.next(_.filter(returnTickets, item => item.status === 'ONLINE' && item.id_operator === this.idOperator));
  // }

  private _setDataOutput(index: number): Observable<ITicket[]> {
    let status = '';
    switch (index) {
      case 0: {
        status = 'NEW';
        break;
      }
      case 1: {
        status = 'ONLINE';
        break;
      }
      case 2: {
        status = 'CLOSED';
        break;
      }
      case 3: {
        status = 'REFUSED';
        break;
      }
      case 4: {
        status = 'ONLINE';
        break;
      }
    }

    return this.apiTicket.getFromDate(environment.APP_TICKET_RETENTION_DAY, status);
  }

}
