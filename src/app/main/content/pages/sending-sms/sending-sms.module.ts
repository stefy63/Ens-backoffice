import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import { SharedModule } from '../../../../core/modules/shared.module';
import { AuthGuard } from '../../../../guard/auth.guard';
import { IsOperatorGuard } from '../../../../guard/is-operator.guard';
import { SendingSmsFormComponent } from './sending-sms-form/sending-sms-form.component';
import { SearchUserDialogComponent } from './search-user-dialog/search-user-dialog.component';
import { ApiUserDataService } from '../../../services/api/api-userdata.service';
import { ApiTicketService } from '../../../services/api/api-ticket.service';
import { ToastMessage } from '../../../services/toastMessage.service';
import { ApiSmsService } from '../../../services/api/api-sms.service';

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
  ],
  providers: [
    ApiUserDataService,
    NotificationsService,
    ApiSmsService,
  ]
})
export class SendingSmsModule { }
