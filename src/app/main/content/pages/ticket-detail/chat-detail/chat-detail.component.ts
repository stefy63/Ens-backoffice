import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'fuse-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatDetailComponent implements OnInit {

  private ticket: ITicket;
  @Input() openTicket:  Observable<ITicket>;
  private open: any = false;

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.openTicket.subscribe(
      ticket => {
        this.ticket = ticket;
        this.cd.markForCheck();
      });
    
  }

}
