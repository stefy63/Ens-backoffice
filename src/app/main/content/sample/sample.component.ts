import { Component } from '@angular/core';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { SocketService } from '../../../services/socket.service';

import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';

@Component({
    selector   : 'fuse-sample',
    templateUrl: './sample.component.html',
    styleUrls  : ['./sample.component.scss']
})

export class FuseSampleComponent
{
    constructor(
        private translationLoader: FuseTranslationLoaderService,
        private socket: SocketService
    )
    {
        this.translationLoader.loadTranslations(english, turkish);
        this.socket.getMessage('onTicketCreate')
            .subscribe(msg => console.log(msg));
    }

    public SocketConnections() {
        this.socket.sendMessage('welcome-message', {
            userToken: '123456789-0987654321',
            idUser: '1',
            status: 'READY',
            userType: 'operator'

        });
    }
}
