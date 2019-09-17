import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { HasPermissionGuard } from '../../../../guard/has-permission.guard';
import { OperatorComponent } from './operator.component';

const routes: Routes = [
  {
      path     : 'pages/operator',
      component: OperatorComponent,
      canActivate: [AuthGuard, IsOperatorGuard, HasPermissionGuard],
      data: {roles: ['operator.export']}
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
  ],
  declarations: [
    OperatorComponent
  ],
  exports     : [
    OperatorComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService
  ]
})
export class OperatorModule { }
