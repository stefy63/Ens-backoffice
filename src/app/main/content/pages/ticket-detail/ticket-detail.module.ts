import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import {TicketDetailComponent} from './ticket-detail.component';
import {AuthGuard} from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { TicketHeadComponent} from './ticket-head/ticket-head.component';
import { TicketMessagesComponent } from './ticket-messages/ticket-messages.component';
import { ChatService } from '../../../services/ticket-messages/ticket-messages.service';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TicketVideoChatComponent } from './ticket-video-chat/ticket-video-chat.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastMessage } from '../../../services/toastMessage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogCloseTicket } from './ticket-head/dialog-component/dialog-close.component';
import { DialogDetail } from './ticket-head/dialog-component/dialog-detail.component';

const routes: Routes = [
    {
        path     : 'pages/ticket-detail/:id',
        canActivate: [AuthGuard, IsOperatorGuard],
        component: TicketDetailComponent
    }
];


@NgModule({
  declarations: [
    TicketDetailComponent,
    TicketHeadComponent,
    TicketMessagesComponent,
    TicketVideoChatComponent,
    DialogCloseTicket,
    DialogDetail,
  ],
  entryComponents: [
    DialogCloseTicket,
    DialogDetail
  ],
  imports: [
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
    ReactiveFormsModule
  ],
  exports: [
    TicketDetailComponent,
  ],
  providers: [
    ChatService,
    ToastMessage,
  ]
})

export class TicketDetailModule { }
