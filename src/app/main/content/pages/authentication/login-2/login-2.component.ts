import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { ApiService } from '../../../../../services/api.service';
import * as moment from 'moment';
import { IDataLogin } from '../../../../../interfaces/i-data-login';
import { AuthService } from '../../../../../services/auth.service';
import { Router } from '@angular/router';

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

    constructor(
        private fuseConfig: FuseConfigService,
        private formBuilder: FormBuilder,
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router
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

    private async onSubmit() {
        await this.apiService.apiLogin(this.loginForm.value as IDataLogin, true)
        .subscribe(
            (data) => {
                localStorage.setItem('user', JSON.stringify(data));
                this.router.navigate(['pages/dashboard']);
            },
            (err) => {
                console.log('---------------------');
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
