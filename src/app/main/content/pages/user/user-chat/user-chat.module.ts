import { NgModule } from '@angular/core';
import { AuthGuard } from '../../../../../guard/auth.guard';
import { Routes, RouterModule } from '@angular/router';
import { UserChatComponent } from './user-chat.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes: Routes = [
  {
      path     : 'pages/user/user-chat',
      canActivate: [AuthGuard],
      component: UserChatComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [
    UserChatComponent
  ]
})
export class UserChatModule { }
