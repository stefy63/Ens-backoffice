import { Component, HostListener } from '@angular/core';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { TranslateService } from '@ngx-translate/core';
import { ApiLoginService } from './services/api/api-login.service';

@Component({
    selector   : 'fuse-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    @HostListener('window:beforeunload', ['$event'])
    beforeunloadHandler(event: Event) {
        this.apiLoginService.apiLogout().subscribe();
    }

    constructor(
        private fuseSplashScreen: FuseSplashScreenService,
        private translate: TranslateService,
        private apiLoginService: ApiLoginService
    )
    {
        // Add languages
        this.translate.addLangs(['en', 'tr']);

        // Set the default language
        this.translate.setDefaultLang('en');

        // Use a language
        this.translate.use('en');
    }

}
