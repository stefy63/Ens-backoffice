export class NavigationModel {
    public model: any[];

    constructor() {
        this.model = [
            {
                'id': 'pages',
                'title': 'Overview',
                'type': 'group',
                'icon': 'pages',
                'children': [
                    {
                        'id': 'dashboard',
                        'title': 'DashBoard',
                        'type': 'item',
                        'icon': 'pages',
                        'url': '/pages/dashboard'
                    },
                    {
                        'id': 'export',
                        'title': 'Report',
                        'type': 'item',
                        'icon': 'trending_up',
                        'url': '/pages/export-report',
                    },
                    {
                        'id': 'sms',
                        'title': 'Invia Sms',
                        'type': 'item',
                        'icon': 'send',
                        'url': '/pages/sending-sms',
                    },
                ]
            },
        ];
    }
}
