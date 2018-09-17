import { NgModule } from '@angular/core';

import { Login2Module } from './authentication/login-2/login-2.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {TicketDetailModule} from './ticket-detail/ticket-detail.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { UsermanagerComponent } from './usermanager/usermanager.component';
import { UsermanagerModule } from './usermanager/usermanager.module';
import { PermissionmanagerModule } from './permissionmanager/permissionmanager.module';
import { CalendarmanagerComponent } from './calendarmanager/calendarmanager.component';
import { CalendarmanagerModule } from './calendarmanager/calendarmanager.module';

@NgModule({
    imports: [
      Login2Module,
      DashboardModule,
      TicketDetailModule,
      UserModule,
      ProfileModule,
      UsermanagerModule,
      PermissionmanagerModule,
      CalendarmanagerModule
    ],
    declarations: []
})
export class PagesModule
{
}
