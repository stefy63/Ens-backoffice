import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagerComponent } from './user-manager.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
      path     : 'pages/user-manager',
      canActivate: [AuthGuard, IsOperatorGuard],
      component: UserManagerComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    UserManagerComponent
  ],
  exports     : [
      UserManagerComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService,
  ]
})
export class UserManagerModule { }
