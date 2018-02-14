export class NavigationModel
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'pages',
                'title'   : 'Funzioni',
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
                    }
                ]
            },
            // {
            //     'id'      : 'applications',
            //     'title'   : 'Applications',
            //     'type'    : 'group',
            //     'children': [
            //         {
            //             'id'   : 'sample',
            //             'title': 'Sample',
            //             'type' : 'item',
            //             'icon' : 'email',
            //             'url'  : '/sample',
            //             // 'badge': {
            //             //     'title': 25,
            //             //     'bg'   : '#F44336',
            //             //     'fg'   : '#FFFFFF'
            //             // }
            //         }
            //     ]
            // }
            
        ];
    }
}
