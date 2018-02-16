import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthGuard } from '../../../../guard/auth.guard';
import { TicketItemComponent } from './ticket-item/ticket-item.component';

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
        RouterModule.forChild(routes)
    ],
    exports     : [
        DashboardComponent
    ]
})

export class Dashboard
{

}
