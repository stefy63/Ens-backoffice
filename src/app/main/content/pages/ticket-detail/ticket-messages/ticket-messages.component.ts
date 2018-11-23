import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
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
import 'rxjs/add/operator/distinctUntilChanged';
import { NgxSpinnerService } from 'ngx-spinner';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';

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
  public pause2scroll = true;

  private historyType: ITicketHistoryType[];
  private isTyping = false;
  private replyInput: any;


  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;
  @ViewChild('onWritingMsg') onWritingMsg: ElementRef;

  public options = ToastOptions;

  constructor(
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private socketService: SocketService,
    private spinner: NgxSpinnerService
  ) {
    this.historyType = this.storage.getItem('ticket_history_type');
  }

  ngOnInit() {
    this.spinner.show();
    this.data.subscribe((item: ITicket) => {
      this.ticket = item;
      if (_.find(item.historys, (history) => history.readed === 0)) {
        this.chatService.markMessagesReaded(item.id).subscribe();
      }
      this.ticketHistorys = _.orderBy(this.ticket.historys, 'date_time', 'asc');
      this.spinner.hide();
      setTimeout(() => {
        this.scrollToBottom(2000);
      }, 500);
      this.cd.markForCheck();
    }, (err) => {
      console.log(err);
    });

    this.socketService.getMessage('onUserWriting')
      .subscribe((data: any) => {
        if (!this.activeSpinner && this.ticket && data.idTicket === this.ticket.id) {
          this.activeSpinner = true;
          setTimeout(() => {
            this.activeSpinner = false;
            this.onWritingMsg.nativeElement.style.display = 'none';
          }, 3000);
          this.onWritingMsg.nativeElement.style.display = 'block';
        }
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

    this.onWritingMsg.nativeElement.style.display = 'none';
    UnreadedMessageEmitterService.subscribe('fast-reply-message', (data) => {
      this.sendMessage(data.description, false);
    });
  }

  readyToReply() {
    if (this.ticket.status.status !== 'REFUSED' && this.ticket.status.status !== 'CLOSED') {
      setTimeout(() => {
        this.resetForm();
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
    if (this.directiveScroll && this.directiveScroll.isInitialized && this.pause2scroll) {
      this.directiveScroll.update();

      setTimeout(() => {
        this.directiveScroll.scrollToBottom(0, speed);
      });
    }
  }

  toglePuseScroll() {
    this.pause2scroll = !this.pause2scroll;
    if (this.pause2scroll) {
      this.scrollToBottom();
    }
  }

  reply(event) {
    if (!!this.replyForm.form.value.message) {
      this.sendMessage(this.replyForm.form.value.message.trim(), true);
    } else {
      this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
      this.resetForm();
    }
  }

  private resetForm() {
    if (this.replyForm) {
      this.replyForm.reset();
    }
  }

  sendMessage(msgToSend: string, resetForm: boolean) {
    if (this.ticket) {
      const message: ITicketHistory = {
        id: null,
        id_ticket: this.ticket.id,
        id_type: HistoryTypes.OPERATOR,
        action: msgToSend,
        readed: 0
      };

      this.spinner.show();
      this.chatService.sendMessage(message).subscribe((data) => {
        this.spinner.hide();
        if (resetForm) {
          this.resetForm();
        }
      });

    }
  }

  public typing(evt) {
    if (!this.isTyping) {
      setTimeout(() => this.isTyping = false, 3000);
      this.isTyping = true;
      this.socketService.sendMessage('send-to', {
        idTicket: this.ticket.id,
        event: 'onUserWriting',
        obj: {}
      });
    }
  }

}
