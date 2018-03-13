import { Component, OnInit, AfterViewInit, Input, ViewChildren, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { ChatService } from '../../../../services/ticket-messages/ticket-messages.service';
import { ToastOptions } from '../../../../../type/toast-options';
import { NotificationsService } from 'angular2-notifications';
import { FusePerfectScrollbarDirective } from '../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'fuse-ticket-note',
  templateUrl: './ticket-note.component.html',
  styleUrls: ['./ticket-note.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketNoteComponent implements OnInit, AfterViewInit {

  @Input('ticket') data: Observable<any>;
  public ticket: ITicket;
  public ticketHistorys: ITicketHistory[];
  private historyType: ITicketHistoryType[];
  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  public options = ToastOptions;

  private replyInput: any;

  constructor(
    private cd: ChangeDetectorRef,
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService
  ) {
  }

  ngOnInit() {
    this.data.subscribe(data => {
      this.ticket = data;
      this.cd.markForCheck();
      this.ticketHistorys = _.chain(data.historys)
                            .filter((item) => item.type.type === 'NOTE')
                            .orderBy( 'date_time', 'asc')
                            .value();

      this.readyToReply();
    });
    this.historyType = this.storage.getItem('ticket_history_type');
  }

  ngAfterViewInit() {
    if (this.ticket.status.status !== 'REFUSED') {
      this.replyInput = this.replyInputField.first.nativeElement;
      this.readyToReply();
      this.cd.detectChanges();
    }
  }

  readyToReply() {
    if (this.ticket.status.status !== 'REFUSED') {
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
      const formMessage: string = (this.replyForm.form.value.message.length > 50 && indexSpace > 70) ?
                                      this.replyForm.form.value.message.substring(0, 50) : this.replyForm.form.value.message;
      const message: ITicketHistory = {
        id: 0,
        id_ticket: this.ticket.id,
        id_type:  _.find(this.historyType, item => item.type === 'NOTE').id,
        // action: this.replyForm.form.value.message + ` [ ${this.ticket.operator.firstname} ${this.ticket.operator.lastname} ]`,
        action: `[ ${this.ticket.operator.firstname} ${this.ticket.operator.lastname} ]\n` + formMessage ,
        readed: 1,
        date_time: new Date().toISOString()
      };


      this.chatService.sendMessage(message)
        .subscribe( data => {
          const ret: ITicketHistory = data;
        });
    } else {
      this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
    }

  }

}
