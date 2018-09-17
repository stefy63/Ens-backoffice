import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CalendarmanagerComponent } from './calendarmanager.component';
import { SharedModule } from '../../../../core/modules/shared.module';
import { SimpleNotificationsModule } from 'angular2-notifications';
// import { AuthGuard } from '../../../../guard/auth.guard';
// import { IsOperatorGuard } from '../../../../guard/is-operator.guard';

const routes: Routes = [
  {
      path     : 'pages/calendarmanager',
      // canActivate: [AuthGuard, IsOperatorGuard],
      component: CalendarmanagerComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule
  ],
  declarations: [CalendarmanagerComponent]
})
export class CalendarmanagerModule { }
