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
import {ScheduleTabComponent} from './schedule-tab/schedule-tab.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {ApiCalendarService} from '../../../services/api/api-calendar.service';
import { AmazingTimePickerModule } from 'amazing-time-picker';


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
    BrowserAnimationsModule,
    CKEditorModule,
    AmazingTimePickerModule,


  ],
  declarations: [
    ScheduleManagerComponent,
    ScheduleTabComponent,
  ],
  exports     : [
    ScheduleManagerComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService,
    ApiCalendarService
  ]
})
export class ScheduleManagerModule { }
