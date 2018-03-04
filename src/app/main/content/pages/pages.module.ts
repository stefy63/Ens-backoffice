import { NgModule } from '@angular/core';

import { Login2Module } from './authentication/login-2/login-2.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import {TicketDetailModule} from './ticket-detail/ticket-detail.module';
import { UserModule } from './user/user.module';


@NgModule({
    imports: [
      Login2Module,
      DashboardModule,
      TicketDetailModule,
      UserModule
    ],
    declarations: []
})
export class PagesModule
{
}
