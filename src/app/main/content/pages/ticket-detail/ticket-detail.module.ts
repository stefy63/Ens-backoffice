import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import {TicketDetailComponent} from './ticket-detail.component';
import {AuthGuard} from '../../../../guard/auth.guard';
import {TicketHeadComponent} from './ticket-head/ticket-head.component';
import {TicketMessagesComponent} from './ticket-messages/ticket-messages.component';
import {ChatService} from '../../../../services/ticket-messages/ticket-messages.service';
import { TicketNoteComponent } from './ticket-note/ticket-note.component';
import { SimpleNotificationsModule } from 'angular2-notifications';


const routes: Routes = [
    {
        path     : 'pages/ticket-detail/:id',
        canActivate: [AuthGuard],
        component: TicketDetailComponent
    }
];


@NgModule({
  declarations: [
      TicketDetailComponent,
      TicketHeadComponent,
      TicketMessagesComponent,
      TicketNoteComponent
    ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  exports     : [
      TicketDetailComponent
  ],
  providers: [
    ChatService
  ]
})

export class TicketDetailModule { }
