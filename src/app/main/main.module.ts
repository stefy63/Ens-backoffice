import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../core/modules/shared.module';

import { FuseMainComponent } from './main.component';
import { FuseContentComponent } from './content/content.component';
import { FuseFooterComponent } from './footer/footer.component';
import { FuseNavbarVerticalComponent } from './navbar/vertical/navbar-vertical.component';
import { FuseToolbarComponent } from './toolbar/toolbar.component';
import { FuseNavigationModule } from '../core/components/navigation/navigation.module';
import { FuseNavbarVerticalToggleDirective } from './navbar/vertical/navbar-vertical-toggle.directive';
import { FuseNavbarHorizontalComponent } from './navbar/horizontal/navbar-horizontal.component';
import { FuseQuickPanelComponent } from './quick-panel/quick-panel.component';
import { FuseThemeOptionsComponent } from '../core/components/theme-options/theme-options.component';
import { FuseShortcutsModule } from '../core/components/shortcuts/shortcuts.module';
import { FuseSearchBarModule } from '../core/components/search-bar/search-bar.module';
import { DialogChangePassword } from './toolbar/dialog-component/dialog-change-password.component';
import { ApiUserService } from './services/api/api-user.service';
import { DialogProfileComponent } from './toolbar/dialog-component/profile/profile.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ApiItalyGeoService } from './services/api/api-italy-geo.service';
import { DialogProfileOperatorComponent } from './content/pages/user-manager/profile_operator/profileOperator.component';

@NgModule({
    declarations: [
        FuseContentComponent,
        FuseFooterComponent,
        FuseMainComponent,
        FuseNavbarVerticalComponent,
        FuseNavbarHorizontalComponent,
        FuseToolbarComponent,
        FuseNavbarVerticalToggleDirective,
        FuseThemeOptionsComponent,
        FuseQuickPanelComponent,
        DialogChangePassword,
        DialogProfileComponent,
        DialogProfileOperatorComponent,
    ],
    imports     : [
        SharedModule,
        RouterModule,
        FuseNavigationModule,
        FuseShortcutsModule,
        FuseSearchBarModule,
        SimpleNotificationsModule

    ],
    exports     : [
        FuseMainComponent
    ],
    entryComponents: [
        DialogChangePassword,
        DialogProfileComponent
    ],
    providers: [
        ApiUserService,
        ApiItalyGeoService
    ]
})

export class FuseMainModule
{
}
