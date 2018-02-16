import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { ApiTicketService } from '../../../../../services/api-ticket.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fuse-ticket-item',
  templateUrl: './ticket-item.component.html',
  styleUrls: ['./ticket-item.component.scss']
})
export class TicketItemComponent implements OnInit, AfterViewInit {

  @Input() allTicket: ITicket[];
  public displayedColumns = ['service.service', 'status.status'];
  public dataSource: MatTableDataSource<ITicket> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private apiTicket: ApiTicketService,
  ) {
    this.apiTicket.get()
      .subscribe(
        data => this.dataSource = new MatTableDataSource(data)
      );

  }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string)
  {
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
  }
}
