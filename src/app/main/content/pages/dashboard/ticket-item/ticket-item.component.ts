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
  public dataBadge: any[] = [];
  @Output() badge: EventEmitter<number> = new EventEmitter<number>();


  public displayedColumns = ['service.service', 
                              'status.status', 
                              'operator.firstname',
                              'user.name',
                              'category.category',
                              'phone',
                              'date_time',
                              // 'closed',
                              'id'
                            ];
                          
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private socketService: SocketService,
    private storage: LocalStorageService,
  ) {  }

  ngOnInit() {
    this.user = this.storage.getItem('user');
    this.allTicket.subscribe(
      (ticket: ITicket[]) => {
        this.dataSource =  new MatTableDataSource(ticket);
        this.cd.markForCheck();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.getUnreadedMessage(ticket);
        this.sumBadge();
      }
    );

    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        this.getUnreadedMessage([data]);
        this.sumBadge();
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.socketService.removeListener(WsEvents.ticketHistory.create);
  }

  ngAfterViewInit()
  { 
    


    this.sort.sortChange.subscribe((sort: Sort) => {
      this.paginator.pageIndex = 0;
      console.log('Filter--> ', sort);
      // const data = this.allTicket.slice();
      // if (!sort.active || sort.direction == '') {
      //   this.sortedData = data;
      //   return;
      // }

      // this.sortedData = data.sort((a, b) => {
      //   let isAsc = sort.direction == 'asc';
      //   switch (sort.active) {
      //     case 'name': return compare(a.name, b.name, isAsc);
      //     case 'calories': return compare(+a.calories, +b.calories, isAsc);
      //     case 'fat': return compare(+a.fat, +b.fat, isAsc);
      //     case 'carbs': return compare(+a.carbs, +b.carbs, isAsc);
      //     case 'protein': return compare(+a.protein, +b.protein, isAsc);
      //     default: return 0;
      //   }
      // });
    });
  
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
        return (item.id_operator === this.user.id && item.status.status === 'ONLINE');
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
    this.badge.emit(sum);
  }
}
// updateFilter(event) {
//   const val = event.target.value.toLowerCase();
//   this.rows = [...this.temp2]; // and here you have to initialize it with your data
//   this.temp = [...this.rows];
//    // filter our data
//    const temp = this.rows.filter(function(d) {
//      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
//    });
//    // update the rows
//    this.rows = temp;
//    // Whenever the filter changes, always go back to the first page
//    this.table.offset = 0;
// }
