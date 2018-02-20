import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import {Observable} from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'fuse-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss']
})
export class ChatDetailComponent implements OnInit {

  @Input('openTicket') ticket:  ITicket;
  public open = true;
  public ticketReason: string;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.ticketReason = this.ticket.historys[0].action;
  }

  activateChat() {

  }

  deleteChat() {
    this.router.navigate(['pages/dashboard']);
  }
}
