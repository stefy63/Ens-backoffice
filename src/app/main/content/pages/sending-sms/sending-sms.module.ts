import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule, Routes } from '@angular/router';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SendingSmsFormComponent } from './sending-sms-form/sending-sms-form.component';

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
    ReactiveFormsModule
  ],
  declarations: [SendingSmsFormComponent]
})
export class SendingSmsModule { }
