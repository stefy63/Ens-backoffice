import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
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
import { FuseSampleModule } from './main/content/sample/sample.module';
import { TranslateModule } from '@ngx-translate/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { environment } from '../environments/environment';
import { SocketService } from './services/socket/socket.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ApiLoginService } from './services/api/api-login.service';
import { AuthService } from './services/auth/auth.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { AuthGuard } from './guard/auth.guard';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ApiTicketService } from './services/api/api-ticket.service';
import { ApiTicketHistoryService } from './services/api/api-ticket-history.service';
import { IsOperatorGuard } from './guard/is-operator.guard';
import { MatTooltipModule } from '@angular/material/tooltip';


const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'pages/user/user-dashboard'
    }
];

const options = {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax : 5000,
        reconnectionAttempts: Infinity,
        multiplex: false,
        path: environment.ws_path
};

const wssPort =  (environment.ws_port) ? ':' + environment.ws_port : '';
const config: SocketIoConfig = { url: environment.ws_url + wssPort, options: options };

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        FuseMainModule,
        FuseSampleModule,
        SocketIoModule.forRoot(config),
        PagesModule,
        SimpleNotificationsModule.forRoot(),
        MDBBootstrapModule.forRoot(),
        MatTooltipModule
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
        IsOperatorGuard,
        LocalStorageService,
        ApiTicketHistoryService
    ],
    bootstrap: [
        AppComponent
    ],
    schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule {
}
