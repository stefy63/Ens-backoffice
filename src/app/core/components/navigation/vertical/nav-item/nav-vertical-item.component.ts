import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../../../main/services/auth/auth.service';

@Component({
    selector   : 'fuse-nav-vertical-item',
    templateUrl: './nav-vertical-item.component.html',
    styleUrls  : ['./nav-vertical-item.component.scss']
})
export class FuseNavVerticalItemComponent implements OnInit
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;

    constructor(private authService: AuthService)
    {
    }

    public canActive(permission: string[] = undefined) {
      let retVal = true;
      if (!!permission) {
        retVal = !!this.authService.hasPermission(permission);
      }
      return retVal;
    }


    ngOnInit()
    {
    }
}
