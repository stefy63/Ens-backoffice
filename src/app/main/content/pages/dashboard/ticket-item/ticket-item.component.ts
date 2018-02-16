import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketItemComponent implements OnInit, AfterViewInit {

  @Input() allTicket: Observable<ITicket[]>;
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
  public dataSource: MatTableDataSource<ITicket>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private cd: ChangeDetectorRef
  ) {  }

  ngOnInit() {
    this.allTicket.subscribe(
      ticket => {
        this.dataSource =  new MatTableDataSource(ticket);
        this.cd.markForCheck();
      }
    );
  }

  ngAfterViewInit()
  {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.cd.reattach();
  }

  applyFilter(filterValue: string)
  {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
