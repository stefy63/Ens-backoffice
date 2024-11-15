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
import { ApiTicketService } from '../services/api/api-ticket.service';
import { MatDialog } from '@angular/material';
import { DialogChangePassword } from './dialog-component/dialog-change-password.component';
import { IUser } from '../../interfaces/i-user';
import { NotificationsService } from 'angular2-notifications';
import { ToastOptions } from '../../type/toast-options';
import { ApiUserService } from '../services/api/api-user.service';
import { DialogProfileComponent } from './dialog-component/profile/profile.component';
import { cloneDeep } from 'lodash';

@Component({
    selector: 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})

export class FuseToolbarComponent implements OnInit, OnDestroy {
    showLoadingBar: boolean;
    horizontalNav: boolean;
    profile: string;
    public totalUnreadedMessages = 0;
    public totalNewedTickets = 0;
    public options = ToastOptions;

    public beep;
    private newHistorySubscription: Subscription;
    private newTicketSubscription: Subscription;
    private user: IUser;
    private fakeOperatorNumber: number;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private fuseConfig: FuseConfigService,
        private storage: LocalStorageService,
        private apiLoginService: ApiLoginService,
        private ticketHistoryService: ApiTicketHistoryService,
        private ticketService: ApiTicketService,
        private socketService: SocketService,
        private toast: NotificationsService,
        private apiUserService: ApiUserService
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
        this.fakeOperatorNumber = (user) ? this.elaborateFakeOperatorId(user.id) : 1;
        if (user) {
            this.profile = user.userdata.name + ' ' + user.userdata.surname + ' [' + this.fakeOperatorNumber + ']';
            this.user = user;
        }

        if (token && token.id_user) {
            this.newHistorySubscription = Observable.merge(
                this.socketService.getMessage(WsEvents.ticketHistory.create),
                this.socketService.getMessage(WsEvents.ticketHistory.updated),
                Observable.of(null)
            ).debounceTime(500).mergeMap(() => this.ticketHistoryService.getUnreadedMessages())
                .subscribe((total: number) => {
                    this.totalUnreadedMessages = total;
                    if (total > 0 && this.totalUnreadedMessages !== total) {
                        this.beep.load();
                        this.beep.play();
                    }
                });

            this.newTicketSubscription = Observable.merge(
                this.socketService.getMessage(WsEvents.ticket.create),
                this.socketService.getMessage(WsEvents.ticket.updated),
                Observable.of(null)
            ).debounceTime(500).mergeMap(() => this.ticketService.getNewedCount())
                .subscribe((count: number) => {
                    this.totalNewedTickets = count;
                });
        }
    }

    ngOnDestroy() {
        if (this.newHistorySubscription) {
            this.newHistorySubscription.unsubscribe();
        }
        if (this.newTicketSubscription) {
            this.newTicketSubscription.unsubscribe();
        }
    }

    logout() {
        this.apiLoginService.apiLogout().subscribe();
        this.storage.clear();
        this.router.navigate(['/']);
    }

    edit_profile() {
        const dialogRef = this.dialog.open(DialogProfileComponent, {
            maxWidth: '850px',
            maxHeight: '600px',
            hasBackdrop: true,
            data: {
                modalData: this.user
            }
        });

        dialogRef
            .afterClosed()
            .filter((result) => !!result)
            .flatMap((result) => this.apiUserService.apiChangeProfile(result))
            .subscribe(user => {
                this.storage.setItem('user', user);
                if (user) {
                    this.profile = user.userdata.name + ' ' + user.userdata.surname + ' [' + this.fakeOperatorNumber + ']';
                    this.user = user;
                }
                this.toast.success('Aggiornamento Profilo', 'Profilo modificato con successo');
            },
                (err) => {
                    this.toast.error('Aggiornamento Profilo', 'Modifica Profilo fallita');
                }
            );
    }

    changeOnlineStatus(event: any) {
        const user = cloneDeep(this.user);
        user.isOnline = event.checked;
        this.apiUserService.apiChangeProfile(user).subscribe(
            (_user) => {
                this.storage.setItem('user', _user);
                this.user = _user;
                this.toast.success('Modifica Stato','Stato cambiato con successo!');
            }, (err) => {
              this.toast.error('Modifica Stato','Errore in validazione utente!');
              event.source.checked = !event.checked;
            }
        );
    }

    change_password() {
        const dialogRef = this.dialog.open(DialogChangePassword, {
            maxWidth: '550px',
            maxHeight: '370px',
            data: {
                modalData: this.user.id
            }
        });
    }

    elaborateFakeOperatorId(id_operator) {
        const date = new Date();
        // tslint:disable-next-line:radix
        return Math.ceil(parseInt('' + date.getDate() + date.getMonth() + '' + date.getFullYear()) * 1000 / parseInt(id_operator)) + date.getMonth() * 10000;
    }
}
