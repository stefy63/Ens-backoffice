import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FuseConfigService } from '../../../../../core/services/config.service';
import { fuseAnimations } from '../../../../../core/animations';
import { ApiLoginService } from '../../../../services/api/api-login.service';
import * as moment from 'moment';
import { IDataLogin } from '../../../../../interfaces/i-data-login';
import { AuthService } from '../../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../services/local-storage/local-storage.service';
import { SocketService } from '../../../../services/socket/socket.service';
import { NotificationsService } from 'angular2-notifications';
import { FuseNavigationService } from '../../../../../core/components/navigation/navigation.service';
import { NavigationModel } from '../../../../../navigation.model';
import { strictEqual } from 'assert';

@Component({
  selector: 'fuse-login-2',
  templateUrl: './login-2.component.html',
  styleUrls: ['./login-2.component.scss'],
  animations: fuseAnimations
})
export class FuseLogin2Component implements OnInit {
  public loginForm: FormGroup;
  public title = environment.login_title;
  public nav_title = environment.nav_title;

  constructor(
    private fuseConfig: FuseConfigService,
    private apiLoginService: ApiLoginService,
    private authService: AuthService,
    private router: Router,
    private storage: LocalStorageService,
    private socketService: SocketService,
    private navService: FuseNavigationService,
    private toast: NotificationsService
  ) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none'
      }
    });
  }

  onSubmit() {
    // const isOperator = this.loginForm.value.operator;
    this.apiLoginService.apiLogin(this.loginForm.value as IDataLogin).subscribe(
      data => {
        this.storage.setItem('data', data);
        if (this.authService.isAuthenticated()) {
          this.socketService.sendMessage('welcome-message', {
            userToken: this.authService.getToken().token_session,
            idUser: data.user.id,
            status: 'READY',
            userType: 'OPERATOR'
          });
          this.navService.setNavigationModel(new NavigationModel());
          this.router.navigate(['pages/dashboard']);
        } else {
          this.toast.error('Attenzione', 'Login Errato!');
        }
      },
      err => {
        this.toast.error('Attenzione', 'Dati Errati!');
      }
    );
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      'username': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    });
  }

  public bgSeason() {
    const mounth = moment()
      .format('MMMM')
      .toString()
      .toLowerCase();
    return `url('/assets/images/backgrounds/${mounth}.jpg') no-repeat`;
  }
}
