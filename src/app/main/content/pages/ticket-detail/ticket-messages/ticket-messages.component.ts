import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatService } from '../../../../../services/ticket-messages/ticket-messages.service';
import { ITicket } from '../../../../../interfaces/i-ticket';
import * as _ from 'lodash';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { ToastOptions } from '../../../../../type/toast-options';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'fuse-ticket-messages',
  templateUrl: './ticket-messages.component.html',
  styleUrls: ['./ticket-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketMessagesComponent implements OnInit, AfterViewInit {

  @Input('ticket') data: Observable<ITicket>;
  public ticket: ITicket;
  public ticketHistorys: ITicketHistory[] = [];
  private historyType: ITicketHistoryType[];


  private replyInput: any;
  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  public options = ToastOptions;

  constructor(
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService
  ) {
    this.historyType = this.storage.getItem('ticket_history_type');
  }

  ngOnInit() {
    this.data.subscribe(item => {
      this.ticket = item;
      this.chatService.markMessagesReaded(item.id).subscribe();
      this.ticketHistorys = _.orderBy(this.ticket.historys, 'date_time', 'asc');
      this.readyToReply();
      this.cd.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.replyInput = this.replyInputField.first.nativeElement;
    this.readyToReply();
    this.cd.detectChanges();
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

  reply(event) {
    if (!!this.replyForm.form.value.message && this.replyForm.form.value.message.charCodeAt() !== 10) {
      const type = (this.storage.getItem('token').id_user) ? 'USER' : 'OPERATOR';
      const message: ITicketHistory = {
        id: null,
        id_ticket: this.ticket.id,
        id_type: _.find(this.historyType, item => item.type === type).id,
        action: this.replyForm.form.value.message,
        readed: 0,
        date_time: new Date().toISOString()
      };

      this.chatService.sendMessage(message)
        .subscribe(data => {
          const ret: ITicketHistory = data;
        });
    } else {
      this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
    }

  }

}
