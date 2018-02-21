import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import {TicketDetailComponent} from './ticket-detail.component';
import {AuthGuard} from '../../../../guard/auth.guard';
import {TicketHeadComponent} from './ticket-head/ticket-head.component';
import {TicketMessagesComponent} from './ticket-head/ticket-messages/ticket-messages.component';
import {ChatService} from '../../../../services/ticket-messages/ticket-messages.service';


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
      TicketMessagesComponent
    ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports     : [
      TicketDetailComponent
  ],
  providers: [
    ChatService
  ]
})

export class TicketDetailModule { }
