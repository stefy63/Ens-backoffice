import { Component, OnInit, Input, ViewChildren, ViewChild } from '@angular/core';
import { ITicket } from '../../../../../interfaces/i-ticket';
import { LocalStorageService } from '../../../../../services/local-storage/local-storage.service';
import { ITicketHistory } from '../../../../../interfaces/i-ticket-history';
import { ITicketHistoryType } from '../../../../../interfaces/i-ticket-history-type';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { ChatService } from '../../../../../services/ticket-messages/ticket-messages.service';
import { ToastOptions } from '../../../../../type/toast-options';
import { NotificationsService, SimpleNotificationsComponent} from 'angular2-notifications';

@Component({
  selector: 'fuse-ticket-note',
  templateUrl: './ticket-note.component.html',
  styleUrls: ['./ticket-note.component.scss']
})
export class TicketNoteComponent implements OnInit {

  @Input() ticket: ITicket;
  public ticketHistorys: ITicketHistory[];
  private historyType: ITicketHistoryType[];
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  public options = ToastOptions;

  constructor(
    private chatService: ChatService,
    private storage: LocalStorageService,
    private toast: NotificationsService
  ) { }

  ngOnInit() {
  }


  async reply(event) {
    if (!!this.replyForm.form.value.message && this.replyForm.form.value.message.charCodeAt() !== 10) {
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
    } else {
      this.toast.error('Messaggio Vuoto', 'Impossibile spedire messaggi vuoti');
    }

  }

}
