import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HasPermissionGuard } from '../../../../guard/has-permission.guard';
import {ScheduleManagerComponent} from './schedule-manager.component';
import {ScheduleItemComponent} from './schedule-item/schedule-item.component';

const routes: Routes = [
  {
      path     : 'pages/schedule-manager',
      component: ScheduleManagerComponent,
      canActivate: [AuthGuard, IsOperatorGuard, HasPermissionGuard],
      data: {roles: ['update.chanels']}
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [
    ScheduleManagerComponent,
    ScheduleItemComponent
  ],
  exports     : [
    ScheduleManagerComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService,
  ]
})
export class ScheduleManagerModule { }
