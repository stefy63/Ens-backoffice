import { Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, ElementRef } from '@angular/core';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { NgForm } from '@angular/forms';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { ChatService } from '../../../../services/ticket-messages/ticket-messages.service';
import { ITicket } from '../../../../../interfaces/i-ticket';
import * as _ from 'lodash';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs/Observable';
import { SocketService } from '../../../../services/socket/socket.service';
import 'rxjs/add/operator/distinctUntilChanged';
import { NgxSpinnerService } from 'ngx-spinner';
import { HistoryTypes } from '../../../../../enums/ticket-history-type.enum';
import { IDefaultDialog } from '../../../../../interfaces/i-defaul-dialog';
import { Subscription } from 'rxjs/Subscription';
import { Status } from '../../../../../enums/ticket-status.enum';
import { Services } from '../../../../../enums/ticket-services.enum';

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

  private isTyping = false;
  private replyInput: any;
  public defaultDialogs: IDefaultDialog[];
  private viewInitFinish = false;
  public showReplyMessage = false;

  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;
  @ViewChild('onWritingMsg') onWritingMsg: ElementRef;

  private ticketSubscription: Subscription;
  private replyEventSubscription: Subscription;
  private timeoutFunction;

  constructor(
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService,
    private socketService: SocketService,
    private spinner: NgxSpinnerService
  ) {
    this.defaultDialogs = _.orderBy(this.storage.getItem('default_dialog'), 'ordine');
  }

  ngOnInit() {
    this.spinner.show();
    this.ticketSubscription = this.data.subscribe((item: ITicket) => {
      this.ticket = item;
      if (_.find(item.historys, (history) => history.readed === 0)) {
        this.chatService.markMessagesReaded(item.id).subscribe();
      }
      this.ticketHistorys = _.orderBy(this.ticket.historys, 'date_time', 'asc');
      this.spinner.hide();
      this.scrollToBottom();
      this.cd.markForCheck();
      this.showReplyMessage = !_.includes([Status.REFUSED, Status.CLOSED], this.ticket.id_status);
    }, (err) => {
      console.log(err);
    });

    this.replyEventSubscription = this.socketService.getMessage('onUserWriting').subscribe((data: any) => {
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
    if (this.ticketSubscription) {
      this.ticketSubscription.unsubscribe();
    }
    if (this.replyEventSubscription) {
      this.replyEventSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.viewInitFinish = true;
    this.replyInput = this.replyInputField.first.nativeElement;
    this.cd.detectChanges();
    this.resetForm();
    this.scrollToBottom();
    this.onWritingMsg.nativeElement.style.display = 'none';
  }

  focusReplyInput() {
    this.replyInput.focus();
  }

  scrollToBottom(speed?: number) {
    speed = speed || 2000;
    if (this.viewInitFinish && this.directiveScroll && this.directiveScroll.isInitialized && this.pause2scroll) {
      this.directiveScroll.update();
      this.directiveScroll.scrollToBottom(0, speed);
    }
  }

  toglePuseScroll() {
    this.pause2scroll = !this.pause2scroll;
    if (this.pause2scroll) {
      this.scrollToBottom();
    }
  }

  reply(event) {
    if (this.replyForm.form.value.message && this.replyForm.form.value.message.trim()) {
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
    if (!this.isTyping && this.ticket.id_service === Services.CHAT) {
      if (this.timeoutFunction) {
        clearTimeout(this.timeoutFunction);
      }
      this.timeoutFunction = setTimeout(() => this.isTyping = false, 3000);
      this.isTyping = true;
      this.socketService.sendMessage('send-to', {
        idTicket: this.ticket.id,
        event: 'onUserWriting',
        obj: {}
      });
    }
  }

  onSelectChange(data: IDefaultDialog): void {
    this.sendMessage(data.description, false);
  }
}
