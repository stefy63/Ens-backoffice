import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiTicketService} from '../../../../services/api/api-ticket.service';
import {ITicket} from '../../../../interfaces/i-ticket';
import { ITicketService } from '../../../../interfaces/i-ticket-service';

@Component({
  selector: 'fuse-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {

  public idTicket: number;
  // private newTicket: ITicket;
  public service: string;
  public ticket: ITicket;

  constructor(
    private route: ActivatedRoute,
    private apiTicket: ApiTicketService
  ) {
    // tslint:disable-next-line:radix
    this.idTicket = parseInt(this.route.snapshot.paramMap.get('id'));
  }

  async ngOnInit() {
    this.ticket = await this.apiTicket.getFromId(this.idTicket);
    this.service = this.ticket.service.service;
  }

}
