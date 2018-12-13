export class NavigationModel
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'pages',
                'title'   : 'Overview',
                'type'    : 'group',
                'icon'    : 'pages',
                'children': [
                    {
                        'id'      : 'dashboard',
                        'title'   : 'DashBoard',
                        'type'    : 'item',
                        'icon'    : 'pages',
                        'url'  : '/pages/dashboard'
                        // 'icon'    : 'lock',
                        // 'children': [
                        //     {
                        //         'id'   : 'login-v2',
                        //         'title': 'Login v2',
                        //         'type' : 'item',
                        //         'icon'    : 'lock',
                        //         'url'  : '/pages/authentication/login-2'
                        //     },
                        // ]
                    },
                      {
                          'id'   : 'export',
                          'title': 'Report',
                          'type' : 'item',
                          'icon' : 'trending_up',
                          'url'  : '/pages/export-report',
                          // 'badge': {
                          //     'title': 25,
                          //     'bg'   : '#F44336',
                          //     'fg'   : '#FFFFFF'
                          // }
                      },
                        {
                        'id'   : 'user_manager',
                        'title': 'Gestione Utenti',
                        'type' : 'item',
                        'icon' : 'sentiment_satisfied',
                        'url'  : '/pages/user_manager',
                        // 'badge': {
                        //     'title': 25,
                        //     'bg'   : '#F44336',
                        //     'fg'   : '#FFFFFF'
                        // }
                    }
                    // {
                    //   'id'      : 'usermanager',
                    //   'title'   : 'Gestione Utenti',
                    //   'type'    : 'item',
                    //   'icon'    : 'face',
                    //   'url'     : '/pages/usermanager'
                    // },
                    // {
                    //   'id'      : 'permissionmanager',
                    //   'title'   : 'Gestione Permessi',
                    //   'type'    : 'item',
                    //   'icon'    : 'fingerprint',
                    //   'url'     : '/pages/permissionmanager'
                    // },
                    // {
                    //   'id'      : 'calenadarmanager',
                    //   'title'   : 'Gestione Calendario',
                    //   'type'    : 'item',
                    //   'icon'    : 'alarm',
                    //   'url'     : '/pages/calendarmanager'
                    // }
                ]
            },
            // {
            //   'id'      : 'analytics',
            //   'title'   : 'Analytics',
            //   'type'    : 'group',
            //   'children': [
            //       {
            //           'id'   : 'export',
            //           'title': 'Report',
            //           'type' : 'item',
            //           'icon' : 'trending_up',
            //           'url'  : '/pages/export-report',
                      // 'badge': {
                      //     'title': 25,
                      //     'bg'   : '#F44336',
                      //     'fg'   : '#FFFFFF'
                      // }
            //       }
            //   ]
            // },
            // {
            //   'id'      : 'user_profile',
            //   'title'   : 'Profilo Utenti',
            //   'type'    : 'group',
            //   'children': [
            //       {
            //           'id'   : 'user_manager',
            //           'title': 'Gestione Utenti',
            //           'type' : 'item',
            //           'icon' : 'sentiment_satisfied',
            //           'url'  : '/pages/user_manager',
            //           // 'badge': {
            //           //     'title': 25,
            //           //     'bg'   : '#F44336',
            //           //     'fg'   : '#FFFFFF'
            //           // }
            //       }
            //   ]
            // }

        ];
    }
}
