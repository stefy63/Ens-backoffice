import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { IUser } from '../../../../../interfaces/i-user';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { SocketService } from '../../../../../services/socket/socket.service';
import { WsEvents } from '../../../../../type/ws-events';
import { UnreadedMessageEmitterService } from '../../../../../services/helper/unreaded-message-emitter.service';

@Component({
  selector: 'fuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketItemComponent implements OnInit, AfterViewInit, OnDestroy {

  private user: IUser;
  private sortedData;


  @Input() allTicket: Observable<ITicket[]>;
  public dataSource: MatTableDataSource<ITicket>;
  public dataBadge: number[] = [];


  public displayedColumns = ['service', 
                              'status', 
                              'operator',
                              'user',
                              'category',
                              'phone',
                              'date_time',
                              'id'
                            ];
                          
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private socketService: SocketService,
    private storage: LocalStorageService,
    private unreadedEmitter: UnreadedMessageEmitterService
  ) {  }

  ngOnInit() {
    this.user = this.storage.getItem('user');
    this.allTicket
      .subscribe((ticket: ITicket[]) => {
        this.sortedData = ticket;
        this.dataSource =  new MatTableDataSource(ticket);
        this.cd.markForCheck();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.getUnreadedMessage(this.sortedData);
        this.sumBadge();
      });
    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        this.getUnreadedMessage([data]);
        this.sumBadge();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.socketService.removeListener(WsEvents.ticketHistory.create);
    this.unreadedEmitter.next(0);
  }

  ngAfterViewInit()
  { 
  }
  
  applyFilter(filterValue: string)
  {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showTicketDetail(item: ITicket) {
    this.router.navigate(['pages/ticket-detail', item.id ]);
  }

  private getUnreadedMessage(ticket: ITicket[]) {

    const myTicket = _.filter(ticket, item => {
        const status = item.status.status || item.status;
        return (item.id_operator === this.user.id && status === 'ONLINE');
      });

      _.forEach(myTicket, item => {
        const unreaded: ITicketHistory[] = _.filter(item.historys, history => {
              return (!history.readed && history.type.type === 'USER');
            });
        this.dataBadge[item.id] = unreaded.length;
      });
  }

  private sumBadge() {
    let sum = 0;
    _.forEach(this.dataBadge, item => { 
      if (item) {
        sum += item;
      }
    });
    this.unreadedEmitter.next(sum);
  }
}
