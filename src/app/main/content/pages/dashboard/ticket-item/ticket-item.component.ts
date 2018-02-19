import { Component, OnInit, Input, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'fuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketItemComponent implements OnInit, AfterViewInit {

  @Input() allTicket: Observable<ITicket[]>;
  public dataSource: MatTableDataSource<ITicket>;

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
    private router: Router
  ) {  }

  ngOnInit() {
    this.allTicket.subscribe(
      ticket => {
        this.dataSource =  new MatTableDataSource(ticket);
        this.cd.markForCheck();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  ngAfterViewInit()
  {
  }

  applyFilter(filterValue: string)
  {
    filterValue = filterValue.trim().toLowerCase(); // Remove whitespace
    // filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showTicketDetail(item: ITicket) {
    console.log(item.id);
    this.router.navigate(['pages/ticket-detail', item.id ]);
  }
}
