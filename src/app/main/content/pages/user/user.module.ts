import { NgModule } from '@angular/core';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { UserChatModule } from './user-chat/user-chat.module';
import { UserVideochatModule } from './user-videochat/user-videochat.module';

@NgModule({
  imports: [
    UserDashboardModule,
    UserChatModule,
    UserVideochatModule
  ],
  declarations: []
})
export class UserModule { }
