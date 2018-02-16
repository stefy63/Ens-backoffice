import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../../guard/auth.guard';
// import { Subscription } from 'rxjs/Subscription';
import { ApiTicketService } from '../../../../services/api-ticket.service';
import { ChatComponent } from './chat.component';

const routes: Routes = [
    {
        path     : 'pages/chat',
        canActivate: [AuthGuard],
        component: ChatComponent
    }
];

@NgModule({
    declarations: [
        ChatComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports     : [
        ChatComponent
    ],
    providers: [
        // Subscription,
        ApiTicketService
    ]
})

export class Chat
{

}
