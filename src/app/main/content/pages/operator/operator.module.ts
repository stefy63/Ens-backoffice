import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { OperatorComponent } from './operator.component';
import { IsAdminGuard } from '../../../../guard/is-admin.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';

const routes: Routes = [
  {
      path     : 'pages/operator',
      component: OperatorComponent,
      canActivate: [AuthGuard, IsAdminGuard, IsOperatorGuard],
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
