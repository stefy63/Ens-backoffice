import { NgModule } from '@angular/core';
import { Login2Module } from './authentication/login-2/login-2.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {TicketDetailModule} from './ticket-detail/ticket-detail.module';
import { SendingSmsModule } from './sending-sms/sending-sms.module';
import { UserManagerModule } from './user-manager/user-manager.module';
import { StatisticsModule } from './statistics/statistics.module';

@NgModule({
    imports: [
      Login2Module,
      DashboardModule,
      TicketDetailModule,
      SendingSmsModule,
      UserManagerModule,
      StatisticsModule,
    ],
    declarations: []
})
export class PagesModule
{
}
