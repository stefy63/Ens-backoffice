import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { ApiLoginService } from '../services/api/api-login.service';
import { UnreadedMessageEmitterService } from '../services/helper/unreaded-message-emitter.service';

@Component({
    selector: 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, OnDestroy {
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    profile: string;
    public totalBadge = 0;
    public beep;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private translate: TranslateService,
        private storage: LocalStorageService,
        private apiLoginService: ApiLoginService,
    ) {
        this.beep = new Audio();
        this.beep.src = '../../../../assets/audio/beep.wav';
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon': 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon': 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon': 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon': 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id': 'en',
                'title': 'English',
                'flag': 'us'
            },
            {
                'id': 'tr',
                'title': 'Turkish',
                'flag': 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if (event instanceof NavigationStart) {
                    this.showLoadingBar = true;
                }
                if (event instanceof NavigationEnd) {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });

    }

    ngOnInit() {
        const user = this.storage.getItem('user');
        const token = this.storage.getItem('token');
        const fakeOperatorNumber = (user) ? this.elaborateFakeOperatorId(user.id) : 1;
        if (user) {
            this.profile = user.userdata.name + ' ' + user.userdata.surname + ' [' + fakeOperatorNumber + ']';
        }

        if (token && token.id_user) {
            UnreadedMessageEmitterService.subscribe('sum_badge', (data) => {
                if (this.totalBadge < data && this.totalBadge !== 0) {
                    this.beep.load();
                    this.beep.play();
                }
                this.totalBadge = data;
            });
        }

    }

    ngOnDestroy() {
    }

    logout() {
        this.apiLoginService.apiLogout().subscribe();
        this.storage.clear();
        // this.router.navigate(['pages/authentication/login-2']);
        this.router.navigate(['/']);
    }

    edit_profile() {
        this.router.navigate(['/pages/profile']);
    }

    search(value) {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang) {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }

    elaborateFakeOperatorId(id_operator) {
        const date = new Date();
        // tslint:disable-next-line:radix
        return Math.ceil(parseInt('' + date.getDate() + date.getMonth() + '' + date.getFullYear()) * 1000 / parseInt(id_operator)) + date.getMonth() * 10000;
    }
}
