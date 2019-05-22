import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';
import { DataAggregationsService } from '../../../services/helper/data-aggregations.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  NgxChartsModule } from '@swimlane/ngx-charts';
import { HasPermissionGuard } from '../../../../guard/has-permission.guard';

const routes: Routes = [
  {
      path     : 'pages/statistics',
      component: StatisticsComponent,
      canActivate: [AuthGuard, IsOperatorGuard, HasPermissionGuard],
      data: {roles: ['statistics.view']}
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
    NgxChartsModule
  ],
  declarations: [
    StatisticsComponent
  ],
  exports     : [
    StatisticsComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService,
    DataAggregationsService
  ]
})
export class StatisticsModule { }
