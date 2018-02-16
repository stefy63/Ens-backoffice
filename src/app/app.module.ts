import { NgModule } from '@angular/core';
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
import { SocketService } from './services/socket.service';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ApiLoginService } from './services/api-login.service';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';
import { AuthGuard } from './guard/auth.guard';

const appRoutes: Routes = [
    {
        path: '**',
        redirectTo: 'pages/dashboard'
    }
];

const config: SocketIoConfig = { url: environment.ws_url + ':' + environment.ws_port, options: {} };

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
        PagesModule
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
        LocalStorageService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
