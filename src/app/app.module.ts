import { NgModule, NO_ERRORS_SCHEMA, ErrorHandler, LOCALE_ID } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { PagesModule } from './main/content/pages/pages.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { TranslateModule } from '@ngx-translate/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { environment } from '../environments/environment';
import { SocketService } from './main/services/socket/socket.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ApiLoginService } from './main/services/api/api-login.service';
import { AuthService } from './main/services/auth/auth.service';
import { LocalStorageService } from './main/services/local-storage/local-storage.service';
import { AuthGuard } from './guard/auth.guard';
import { IsAdminGuard } from './guard/is-admin.guard';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ApiTicketHistoryService } from './main/services/api/api-ticket-history.service';
import { IsOperatorGuard } from './guard/is-operator.guard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RollbarErrorHandler } from './main/services/errors/RollbarErrorHandler.service';
import { ApiTicketReportService } from './main/services/api/api-ticket-report.service';
import { ExportmanagerComponent } from '../app/main/content/pages/exportmanager/exportmanager.component';
import { ApiStatisticsService } from './main/services/api/api-statistics.service';
import { HasPermissionGuard } from './guard/has-permission.guard';
import {ErrorMessageTranslatorService} from './main/services/error-message-translator.service';

const appRoutes: Routes = [
    {
        path: 'pages/export-report',
        canActivate: [AuthGuard, IsOperatorGuard],
        component: ExportmanagerComponent
    },
    {
        path: '**',
        redirectTo: 'pages/authentication/login-2'
    }
];

const options = {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    multiplex: false,
    path: environment.ws_path,
    transports: ['websocket']
};

const wssPort = (environment.ws_port) ? ':' + environment.ws_port : '';
const config: SocketIoConfig = { url: environment.ws_url + wssPort, options: options };

@NgModule({
    declarations: [
        AppComponent,
        ExportmanagerComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        SocketIoModule.forRoot(config),
        PagesModule,
        SimpleNotificationsModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        MatTooltipModule,

    ],
    providers: [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        SocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        ApiLoginService,
        AuthService,
        AuthGuard,
        HasPermissionGuard,
        IsOperatorGuard,
        IsAdminGuard,
        LocalStorageService,
        ApiTicketHistoryService,
        { provide: ErrorHandler, useClass: RollbarErrorHandler },
        ApiTicketReportService,
        ApiStatisticsService,
        ErrorMessageTranslatorService
    ],
    bootstrap: [
        AppComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
}
