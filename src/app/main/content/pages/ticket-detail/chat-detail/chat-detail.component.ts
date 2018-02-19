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
  private open = true;

  constructor(
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  activateChat() {

  }

  deleteChat() {
    this.router.navigate(['pages/dashboard']);
  }
}
