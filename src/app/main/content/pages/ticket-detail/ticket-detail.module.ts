import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import {TicketDetailComponent} from './ticket-detail.component';
import {AuthGuard} from '../../../../guard/auth.guard';
import { ChatDetailComponent } from './chat-detail/chat-detail.component';
import { ChatComponent } from './chat-detail/chat/chat.component';


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
      ChatDetailComponent,
      ChatComponent
    ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports     : [
      TicketDetailComponent
  ]
})

export class TicketDetailModule { }
