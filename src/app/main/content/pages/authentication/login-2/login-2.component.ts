import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { ApiLoginService } from '../../../../../services/api-login.service';
import * as moment from 'moment';
import { IDataLogin } from '../../../../../interfaces/i-data-login';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../../services/local-storage.service';
import { SocketService } from '../../../../../services/socket.service';
import { NotificationsService } from 'angular2-notifications';
import { ToastOptions } from '../../../../../../environments/toast-options';

@Component({
    selector   : 'fuse-login-2',
    templateUrl: './login-2.component.html',
    styleUrls  : ['./login-2.component.scss'],
    animations : fuseAnimations
})
export class FuseLogin2Component implements OnInit
{
    loginForm: FormGroup;
    loginFormErrors: any;
    public options = ToastOptions;

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private apiLoginService: ApiLoginService,
        private authService: AuthService,
        private router: Router,
        private storage: LocalStorageService,
        private socketService: SocketService,
        private toast: NotificationsService
    )
    {

        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });

        this.loginFormErrors = {
            username   : {},
            password: {}
        };
    }

    private onSubmit() {
      this.apiLoginService.apiLogin(this.loginForm.value as IDataLogin, true)
        .subscribe(
           (data) => {
                this.storage.setItem('data', data);
                if (this.authService.isAuthenticated()) {
                    console.log(this.authService.getToken().token_session);
                    this.socketService.sendMessage(
                        'welcome-message',
                        {
                            userToken: this.authService.getToken().token_session,
                            idUser: data.user.id,
                            status: 'READY',
                            userType: 'OPERATOR'
                        }
                    );
                    this.router.navigate(['pages/dashboard']);
                } else {
                    this.toast.error('Attenzione', 'Login Errato!');
                }
            },
            (err) => {
                this.toast.error('Attenzione', 'Login Errato!');
                console.log(err);
            }
        );
    }

    ngOnInit()
    {
        this.loginForm = this.formBuilder.group({
            username   : ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.loginForm.valueChanges.subscribe(() => {
            this.onLoginFormValuesChanged();
        });
    }

    onLoginFormValuesChanged()
    {
        for ( const field in this.loginFormErrors )
        {
            if ( !this.loginFormErrors.hasOwnProperty(field) )
            {
                continue;
            }

            // Clear previous errors
            this.loginFormErrors[field] = {};

            // Get the control
            const control = this.loginForm.get(field);

            if ( control && control.dirty && !control.valid )
            {
                this.loginFormErrors[field] = control.errors;
            }
        }
    }

    public bgSeason() {
        const mounth = moment().format('MMMM').toString().toLowerCase();
        return `url('/assets/images/backgrounds/${mounth}.jpg') no-repeat`;
    }
}
