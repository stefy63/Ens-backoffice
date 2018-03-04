import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../../guard/auth.guard';
import { UserDashboardComponent } from './user-dashboard.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes: Routes = [
  {
      path     : 'pages/user/user-dashboard',
      canActivate: [AuthGuard],
      component: UserDashboardComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [
    UserDashboardComponent
  ]
})
export class UserDashboardModule { }
