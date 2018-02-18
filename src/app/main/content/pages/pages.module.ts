import { NgModule } from '@angular/core';

import { Login2Module } from './authentication/login-2/login-2.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import {TicketDetailModule} from './ticket-detail/ticket-detail.module';


@NgModule({
    imports: [
      Login2Module,
      DashboardModule,
      TicketDetailModule
    ],
    declarations: [ ]
})
export class PagesModule
{
}
