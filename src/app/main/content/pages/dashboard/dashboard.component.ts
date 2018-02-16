///<reference path="../../../../services/api-ticket.service.ts"/>
import {Component, OnInit} from '@angular/core';
import { ApiTicketService } from '../../../../services/api-ticket.service';
import { ITicket } from '../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'fuse-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  private ticket: ITicket[] = [];

  constructor(
    private apiTicket: ApiTicketService,
    private storage: LocalStorageService
  ) {
    // this.apiTicket.get()
    //   .subscribe(
    //     data => this.ticket = data
    //   );
  }

  ngOnInit() {
  }
}
