import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SendingSmsFormComponent } from './sending-sms-form/sending-sms-form.component';
import { MaterialModule } from '../../../../core/modules/material.module';
import { SearchUserDialogComponent } from './search-user-dialog/search-user-dialog.component';

const routes: Routes = [
  {
      path     : 'pages/sending-sms',
      canActivate: [AuthGuard, IsOperatorGuard],
      component: SendingSmsFormComponent
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    SimpleNotificationsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    SendingSmsFormComponent,
    SearchUserDialogComponent
  ],
  entryComponents: [
    SearchUserDialogComponent
  ]
})
export class SendingSmsModule { }
