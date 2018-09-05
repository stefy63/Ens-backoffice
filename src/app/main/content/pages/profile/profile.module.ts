import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { AuthGuard } from '../../../../guard/auth.guard';
// import { IsOperatorGuard } from '../../../../guard/is-operator.guard';


const routes: Routes = [
  {
      path     : 'pages/profile',
      // canActivate: [AuthGuard, IsOperatorGuard],
      component: ProfileComponent
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
    ProfileComponent
  ],
  // exports     : [
  //   ProfileComponent
  // ]
})
export class ProfileModule { }
