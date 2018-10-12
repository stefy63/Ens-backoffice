import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionmanagerComponent } from './permissionmanager.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { AuthGuard } from '../../../../guard/auth.guard';
// import { IsOperatorGuard } from '../../../../guard/is-operator.guard';

const routes: Routes = [
  {
      path     : 'pages/permissionmanager',
      // canActivate: [AuthGuard, IsOperatorGuard],
      component: PermissionmanagerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [PermissionmanagerComponent]
})
export class PermissionmanagerModule { }
