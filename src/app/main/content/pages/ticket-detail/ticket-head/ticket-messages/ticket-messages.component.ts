import {Component, OnInit, Input, AfterViewInit, ViewChild, ViewChildren} from '@angular/core';
import { ITicketHistory } from '../../../../../../interfaces/i-ticket-history';
import { NgForm } from '@angular/forms';
import {FusePerfectScrollbarDirective} from '../../../../../../core/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import {ChatService} from '../../../../../../services/ticket-messages/ticket-messages.service';


@Component({
  selector: 'fuse-ticket-messages',
  templateUrl: './ticket-messages.component.html',
  styleUrls: ['./ticket-messages.component.scss']
})
export class TicketMessagesComponent implements OnInit, AfterViewInit {

  @Input() historys: ITicketHistory[];

  user: any;
  chat: any;
  dialog: any;
  contact: any;
  replyInput: any;
  selectedChat: any;
  @ViewChild(FusePerfectScrollbarDirective) directiveScroll: FusePerfectScrollbarDirective;
  @ViewChildren('replyInput') replyInputField;
  @ViewChild('replyForm') replyForm: NgForm;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.historys.splice(0, 1);
  }

  // ngOnInit()
  // {
  //   this.user = this.chatService.user;
  //   this.chatService.onChatSelected
  //     .subscribe(chatData => {
  //       if ( chatData )
  //       {
  //         this.selectedChat = chatData;
  //         this.contact = chatData.contact;
  //         this.dialog = chatData.dialog;
  //         this.readyToReply();
  //       }
  //     });
  // }

  ngAfterViewInit()
  {
    // this.replyInput = this.replyInputField.first.nativeElement;
    // this.readyToReply();
  }

  // selectContact()
  // {
  //   this.chatService.selectContact(this.contact);
  // }

  readyToReply()
  {
    setTimeout(() => {
      this.replyForm.reset();
      this.focusReplyInput();
      // this.scrollToBottom();
    });

  }

  focusReplyInput()
  {
    setTimeout(() => {
      this.replyInput.focus();
    });
  }

  scrollToBottom(speed?: number)
  {
    speed = speed || 400;
    if ( this.directiveScroll )
    {
      this.directiveScroll.update();

      setTimeout(() => {
        this.directiveScroll.scrollToBottom(0, speed);
      });
    }
  }

  reply(event)
  {
    // Message
    const message = {
      who    : this.user.id,
      message: this.replyForm.form.value.message,
      time   : new Date().toISOString()
    };

    // Add the message to the chat
    this.dialog.push(message);

    // Update the server
    this.chatService.updateDialog(this.selectedChat.chatId, this.dialog).then(response => {
      this.readyToReply();
    });

  }

}
