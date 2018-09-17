import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UsermanagerComponent } from './usermanager.component';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { AuthGuard } from '../../../../guard/auth.guard';
// import { IsOperatorGuard } from '../../../../guard/is-operator.guard';

const routes: Routes = [
  {
      path     : 'pages/usermanager',
      // canActivate: [AuthGuard, IsOperatorGuard],
      component: UsermanagerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [
    UsermanagerComponent
  ],
  // exports     : [
  //   UsermanagerComponent
  // ]
})
export class UsermanagerModule { }
