import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../../guard/auth.guard';
import { UserVideochatComponent } from './user-videochat.component';
import { SimpleNotificationsModule } from 'angular2-notifications';


const routes: Routes = [
  {
      path     : 'pages/user/user-videochat',
      canActivate: [AuthGuard],
      component: UserVideochatComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [
    UserVideochatComponent
  ]
})
export class UserVideochatModule { }
