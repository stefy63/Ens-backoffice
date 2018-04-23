import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatService } from '../../../../services/ticket-messages/ticket-messages.service';
import { ITicket } from '../../../../../interfaces/i-ticket';
import * as _ from 'lodash';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ToastOptions } from '../../../../../type/toast-options';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../../../services/socket/socket.service';
import { UnreadedMessageEmitterService } from '../../../../services/helper/unreaded-message-emitter.service';


@Component({
  selector: 'fuse-ticket-messages',
  templateUrl: './ticket-messages.component.html',
  styleUrls: ['./ticket-messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TicketMessagesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('ticket') data: Observable<ITicket>;
  public ticket: ITicket;
  public ticketHistorys: ITicketHistory[] = [];
  public activeSpinner = false;
  private historyType: ITicketHistoryType[];
  private isTyping = false;


  private replyInput: any;
  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  public options = ToastOptions;

  constructor(
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private socketService: SocketService
  ) {
    this.historyType = this.storage.getItem('ticket_history_type');
  }

  ngOnInit() {
    this.data.subscribe(item => {
      this.ticket = item;
      this.chatService.markMessagesReaded(item.id).subscribe();
      this.ticketHistorys = _.orderBy(this.ticket.historys, 'date_time', 'asc');
      setTimeout(() => {
        this.scrollToBottom(2000);
      });
      this.cd.markForCheck();
    },
    (err) => {
      console.log(err);
    });

    this.socketService.getMessage('onUserWriting')
      .subscribe((data: any) => {
        console.log('onUserWriting -> ', data);
        if (!this.activeSpinner && data.obj.idTicket === this.ticket.id) {
        this.activeSpinner = true;
          setTimeout(() => {
            this.activeSpinner = false;
          }, 3000);
        }
      });

      UnreadedMessageEmitterService.subscribe('defaul-message', (data) => {
        this.replyForm.reset();
        this.replyInput.value = data.description;
        this.replyForm.form.value.message = data.description;
      });
  }

  ngOnDestroy() {
    this.ticket = null;
  }

  ngAfterViewInit() {
    if (this.ticket.status.status !== 'REFUSED' && this.ticket.status.status !== 'CLOSED') {
      this.replyInput = this.replyInputField.first.nativeElement;
      this.readyToReply();
      this.cd.detectChanges();
      this.focusReplyInput();
    }
  }

  readyToReply() {
    if (this.ticket.status.status !== 'REFUSED' && this.ticket.status.status !== 'CLOSED') {
      setTimeout(() => {
        this.replyForm.reset();
        // this.focusReplyInput();
        this.scrollToBottom(2000);
      });
    }

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
      let indexSpace = this.replyForm.form.value.message.indexOf(' ');
      indexSpace = (indexSpace === -1) ? 100 : indexSpace;
      const formMessage: string = (this.replyForm.form.value.message.length > 70 && indexSpace > 70) ?
                                      this.replyForm.form.value.message.substring(0, 70) : this.replyForm.form.value.message;

      this.sendMessage(formMessage);
    } else {
      this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
    }

  }

  sendMessage(msgToSend: string) {
    this.replyForm.reset();
    const type = (this.storage.getItem('token').id_user) ? 'USER' : 'OPERATOR';
    const message: ITicketHistory = {
      id: null,
      id_ticket: this.ticket.id,
      id_type: _.find(this.historyType, item => item.type === type).id,
      // action: this.replyForm.form.value.message,
      action: msgToSend,
      readed: 0
    };

    this.chatService.sendMessage(message).subscribe();
  }

  public typing(evt) {
    if (!this.isTyping) {
      setTimeout(() => this.isTyping = false, 3000);
      this.isTyping = true;
      const token = this.storage.getItem('token');
      this.socketService.sendMessage(
        'send-to',
        {
          idTicket: this.ticket.id,
          // sendTo: (token.id_user) ? 'OPERATOR' : 'USER',
          event: 'onUserWriting',
          obj: {}
        }
      );
    }
  }

}
