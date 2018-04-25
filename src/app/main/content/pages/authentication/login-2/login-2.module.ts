import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';

import { FuseLogin2Component } from './login-2.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

const routes = [
    {
        path     : 'pages/authentication/login-2',
        component: FuseLogin2Component
    }
];

@NgModule({
    declarations: [
        FuseLogin2Component
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes),
        SimpleNotificationsModule
    ]
})

export class Login2Module
{

}
