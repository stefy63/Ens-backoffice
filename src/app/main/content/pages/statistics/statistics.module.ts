import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
      path     : 'pages/statistics',
      canActivate: [AuthGuard, IsOperatorGuard],
      component: StatisticsComponent
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
    StatisticsComponent
  ],
  exports     : [
    StatisticsComponent
  ],
  entryComponents: [
  ],
  providers: [
    NotificationsService,
  ]
})
export class StatisticsModule { }
