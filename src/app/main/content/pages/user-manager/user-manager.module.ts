import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagerComponent } from './user-manager.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsAdminGuard } from '../../../../guard/is-admin.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogProfileComponent } from './profile/profile.component';
import {DialogRegistrationComponent} from './registration/regstration.component'
import { DialogProfileOperatorComponent } from './profile_operator/profileOperator.component';

const routes: Routes = [
  {
      path     : 'pages/user-manager',
      canActivate: [IsAdminGuard, AuthGuard, IsOperatorGuard ],
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
    UserManagerComponent,
    DialogProfileComponent,
    DialogRegistrationComponent
  ],
  exports     : [
      UserManagerComponent
  ],
  entryComponents: [
    DialogProfileComponent,
    DialogRegistrationComponent,
    DialogProfileOperatorComponent
  ],
  providers: [
    NotificationsService,
  ]
})
export class UserManagerModule { }
