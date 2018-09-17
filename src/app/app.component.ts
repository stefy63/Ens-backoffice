import { Component, HostListener } from '@angular/core';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiLoginService } from './main/services/api/api-login.service';
import {SocketService} from './main/services/socket/socket.service';
import {LocalStorageService} from './main/services/local-storage/local-storage.service';
import {AuthService} from './main/services/auth/auth.service';
// import * as moment from 'moment';
// import 'moment/locale/it';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{

    constructor(
        private fuseSplashScreen: FuseSplashScreenService,
        private translate: TranslateService,
        private apiLoginService: ApiLoginService,
        private socketService: SocketService,
        private storage: LocalStorageService,
        private authService: AuthService
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'tr']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Use a language
        this.translate.use('en');

        if (this.authService.isAuthenticated()) {
          const token = this.storage.getItem('token');
          this.socketService.sendMessage(
            'welcome-message',
            {
              userToken: token.token_session,
              idUser: token.id_user,
              status: 'READY',
              userType: 'OPERATOR'
            });
        }

        // moment.locale('it');
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: Event) {
        this.apiLoginService.apiLogout().subscribe();
    }

}
