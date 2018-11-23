import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { LocalStorageService } from '../services/local-storage/local-storage.service';
import { ApiLoginService } from '../services/api/api-login.service';
import { ApiTicketHistoryService } from '../services/api/api-ticket-history.service';
import { SocketService } from '../services/socket/socket.service';
import { WsEvents } from '../../type/ws-events';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import { Subscription } from 'rxjs/Subscription';
@Component({
    selector: 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, OnDestroy {
    showLoadingBar: boolean;
    horizontalNav: boolean;
    profile: string;
    public totalBadge = 0;
    public beep;
    private newHistorySubscription: Subscription;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private storage: LocalStorageService,
        private apiLoginService: ApiLoginService,
        private ticketHistoryService: ApiTicketHistoryService,
        private socketService: SocketService,
    ) {
        this.beep = new Audio('../../../../assets/audio/beep.wav');

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
            this.newHistorySubscription = Observable.merge(
                this.socketService.getMessage(WsEvents.ticketHistory.create),
                this.socketService.getMessage(WsEvents.ticketHistory.updated),
                Observable.of(null)
            ).debounceTime(500).mergeMap(() => this.ticketHistoryService.getUnreadedMessages())
                .subscribe((total: number) => {
                    this.totalBadge = total;
                    if (total > 0 && this.totalBadge !== total) {
                        this.beep.load();
                        this.beep.play();
                    }
                });
        }
    }

    ngOnDestroy() {
        if (this.newHistorySubscription) {
            this.newHistorySubscription.unsubscribe();
        }
    }

    logout() {
        this.apiLoginService.apiLogout().subscribe();
        this.storage.clear();
        this.router.navigate(['/']);
    }

    edit_profile() {
        this.router.navigate(['/pages/profile']);
    }

    elaborateFakeOperatorId(id_operator) {
        const date = new Date();
        // tslint:disable-next-line:radix
        return Math.ceil(parseInt('' + date.getDate() + date.getMonth() + '' + date.getFullYear()) * 1000 / parseInt(id_operator)) + date.getMonth() * 10000;
    }
}
