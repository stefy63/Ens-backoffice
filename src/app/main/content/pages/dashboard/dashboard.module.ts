import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../../guard/auth.guard';
import { TicketItemComponent } from './ticket-item/ticket-item.component';
// import { Subscription } from 'rxjs/Subscription';
import { ApiTicketService } from '../../../../services/api-ticket.service';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes: Routes = [
    {
        path     : 'pages/dashboard',
        canActivate: [AuthGuard],
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [
        DashboardComponent,
        TicketItemComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes),
        SimpleNotificationsModule
    ],
    exports     : [
        DashboardComponent
    ],
    providers: [
        // Subscription,
        ApiTicketService
    ]
})

export class Dashboard
{

}
