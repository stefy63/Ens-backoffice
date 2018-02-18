import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiTicketService} from '../../../../services/api-ticket.service';
import {ITicket} from '../../../../interfaces/i-ticket';
import { ITicketService } from '../../../../interfaces/i-ticket-service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'fuse-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {
  
  private idTicket: number;
  private newTicket: ITicket;
  private ticket: BehaviorSubject<ITicket> = new BehaviorSubject<ITicket>(this.newTicket);

  constructor(
    private route: ActivatedRoute,
    private apiTicket: ApiTicketService
  ) {
    this.idTicket = parseInt(this.route.snapshot.paramMap.get('id'), 10);
    this.apiTicket.getFromId(this.idTicket)
      .subscribe(
        data => {
          this.newTicket = data;
          this.ticket.next(data);
        }
      );
  }

  ngOnInit() {
  }

}
