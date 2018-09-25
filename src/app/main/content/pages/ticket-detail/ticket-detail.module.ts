import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { TicketDetailComponent } from './ticket-detail.component';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { TicketHeadComponent, DialogOverviewExampleDialog } from './ticket-head/ticket-head.component';
import { TicketMessagesComponent } from './ticket-messages/ticket-messages.component';
import { ChatService } from '../../../services/ticket-messages/ticket-messages.service';
import { TicketNoteComponent } from './ticket-note/ticket-note.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { TicketVideoChatComponent } from './ticket-video-chat/ticket-video-chat.component';
import { NgxSpinnerModule } from 'ngx-spinner';

const routes: Routes = [
  {
    path: 'pages/ticket-detail/:id',
    canActivate: [AuthGuard, IsOperatorGuard],
    component: TicketDetailComponent
  }
];


@NgModule({
  declarations: [
    TicketDetailComponent,
    TicketHeadComponent,
    TicketMessagesComponent,
    TicketNoteComponent,
    TicketVideoChatComponent,
    DialogOverviewExampleDialog,
  ],
  entryComponents: [
    DialogOverviewExampleDialog
  ],
  imports: [
    SharedModule,
    NgxSpinnerModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
  ],
  exports: [
    TicketDetailComponent
  ],
  providers: [
    ChatService
  ]
})

export class TicketDetailModule { }
