import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ITicket } from '../../../../../interfaces/i-ticket';

@Component({
  selector: 'fuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketItemComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    this.allTicket
      .subscribe((ticket: ITicket[]) => {
        this.dataSource = new MatTableDataSource(ticket);
        this.cd.markForCheck();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  showTicketDetail(item: ITicket) {
    this.router.navigate(['pages/ticket-detail', item.id]);
  }
}
