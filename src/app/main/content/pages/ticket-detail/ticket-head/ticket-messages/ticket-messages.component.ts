import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren } from '@angular/core';
import { ITicketHistory } from '../../../../../../interfaces/i-ticket-history';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatService } from '../../../../../../services/ticket-messages/ticket-messages.service';
import { ITicket } from '../../../../../../interfaces/i-ticket';
import * as _ from 'lodash';
import { ITicketHistoryType } from '../../../../../../interfaces/i-ticket-history-type';
import { LocalStorageService } from '../../../../../../services/local-storage/local-storage.service';
import { SocketService } from '../../../../../../services/socket/socket.service';
import { WsEvents } from '../../../../../../type/ws-events';


@Component({
  selector: 'fuse-ticket-messages',
  templateUrl: './ticket-messages.component.html',
  styleUrls: ['./ticket-messages.component.scss']
})
export class TicketMessagesComponent implements OnInit, AfterViewInit {

  @Input() ticket: ITicket;
  public ticketHistorys: ITicketHistory[];
  private historyType: ITicketHistoryType[];


  private replyInput: any;
  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  constructor(
    private chatService: ChatService, 
    private storage: LocalStorageService,
    private socketService: SocketService
  ) {
  }

  ngOnInit() {
    this.ticketHistorys = _.orderBy(this.ticket.historys, 'date_time', 'asc');
    this.historyType = this.storage.getItem('ticket_history_type');
    this.chatService.markMessagesReaded(this.ticket.id);

    this.socketService.getMessage(WsEvents.ticketHistory.create)
      .subscribe((data: ITicket) => {
        const historys: ITicketHistory[] = _.orderBy(data.historys, 'date_time', 'asc');
        this.ticketHistorys.push(historys[historys.length - 1]);
        console.log(historys);
        this.readyToReply();
      });

  }

  ngAfterViewInit() {
    this.replyInput = this.replyInputField.first.nativeElement;
    this.readyToReply();
  }

  readyToReply() {
    setTimeout(() => {
      this.replyForm.reset();
      this.focusReplyInput();
      this.scrollToBottom(2000);
    });

  }

  focusReplyInput() {
    setTimeout(() => {
      this.replyInput.focus();
    });
  }

  scrollToBottom(speed?: number) {
    speed = speed || 400;
    if (this.directiveScroll) {
      this.directiveScroll.update();

      setTimeout(() => {
        this.directiveScroll.scrollToBottom(0, speed);
      });
    }
  }

  async reply(event) {
    const type = (this.storage.getItem('token').id_user) ? 'USER' : 'OPERATOR';

    const message: ITicketHistory = {
      id: 0,
      id_ticket: this.ticket.id,
      id_type:  _.find(this.historyType, item => item.type === type).id,
      action: this.replyForm.form.value.message,
      readed: 0,
      date_time: new Date().toISOString()
    };

    const ret: ITicketHistory = await this.chatService.sendMessage(message);

  }

}
