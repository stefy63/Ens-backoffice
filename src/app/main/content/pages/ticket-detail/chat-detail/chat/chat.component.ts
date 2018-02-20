import { Component, OnInit, Input } from '@angular/core';
import { ITicketHistory } from '../../../../../../interfaces/i-ticket-history';

@Component({
  selector: 'fuse-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @Input() historys: ITicketHistory[];

  constructor() { 
  }

  ngOnInit() {
    this.historys.splice(0,1);
  }

}
