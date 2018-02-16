import { NgModule } from '@angular/core';

import { Login2Module } from './authentication/login-2/login-2.module';
import { Dashboard } from './dashboard/dashboard.module';
import { AuthGuard } from '../../../guard/auth.guard';
import { AuthService } from '../../../services/auth.service';


@NgModule({
    imports: [
        Login2Module,
        Dashboard
    ]
})
export class PagesModule
{
}
